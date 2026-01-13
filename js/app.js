/**
 * Ajeer Frontend - Core Application Logic
 * Supports both Supabase and LocalStorage
 */

class StorageManager {
    static STORAGE_KEY = 'ajeer_contracts';
    static TABLE_NAME = 'contracts';

    // Check if Supabase is available
    static isSupabaseAvailable() {
        return typeof supabaseClient !== 'undefined' && supabaseClient !== null && isSupabaseEnabled;
    }

    // Get all contracts
    static async getContracts() {
        if (this.isSupabaseAvailable()) {
            try {
                const { data, error } = await supabaseClient
                    .from(this.TABLE_NAME)
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                return data.map(c => this.normalizeContract(c)) || [];
            } catch (error) {
                console.error('Supabase error:', error);
                return this.getContractsFromLocal();
            }
        }
        return this.getContractsFromLocal();
    }

    // Get single contract by ID
    static async getContract(id) {
        if (this.isSupabaseAvailable()) {
            try {
                const { data, error } = await supabaseClient
                    .from(this.TABLE_NAME)
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                return this.normalizeContract(data);
            } catch (error) {
                console.error('Supabase error:', error);
                return this.getContractFromLocal(id);
            }
        }
        return this.getContractFromLocal(id);
    }

    // Save (Create or Update) contract
    static async saveContract(contract) {
        if (this.isSupabaseAvailable()) {
            try {
                // Clean up the contract object
                // Clean up the contract object - Use explicit checks to preserve empty strings
                const cleanContract = {
                    contract_type: contract.contractType !== undefined ? contract.contractType : contract.contract_type || 'تعاقد أجير',
                    contract_number: contract.contractNumber !== undefined ? contract.contractNumber : contract.contract_number,
                    worker_name: contract.workerName !== undefined ? contract.workerName : contract.worker_name,
                    worker_profession: contract.workerProfession !== undefined ? contract.workerProfession : contract.worker_profession,
                    worker_id_number: contract.workerIdNumber !== undefined ? contract.workerIdNumber : contract.worker_id_number,
                    worker_nationality: contract.workerNationality !== undefined ? contract.workerNationality : contract.worker_nationality,
                    provider_entity: contract.providerEntity !== undefined ? contract.providerEntity : contract.provider_entity,
                    provider_hr_id: contract.providerHrId !== undefined ? contract.providerHrId : contract.provider_hr_id,
                    beneficiary_entity: contract.beneficiaryEntity !== undefined ? contract.beneficiaryEntity : contract.beneficiary_entity,
                    beneficiary_hr_id: contract.beneficiaryHrId !== undefined ? contract.beneficiaryHrId : contract.beneficiary_hr_id,
                    contract_summary: contract.contractSummary !== undefined ? contract.contractSummary : contract.contract_summary,
                    start_date: contract.startDate !== undefined ? contract.startDate : contract.start_date,
                    end_date: contract.endDate !== undefined ? contract.endDate : contract.end_date,
                    work_locations: contract.workLocations !== undefined ? contract.workLocations : contract.work_locations,
                    is_blocked: contract.isBlocked !== undefined ? contract.isBlocked : contract.is_blocked || false,
                    blocked_reason: contract.blockedReason !== undefined ? contract.blockedReason : contract.blocked_reason || null
                };

                if (contract.id) {
                    // Update existing
                    const { data, error } = await supabaseClient
                        .from(this.TABLE_NAME)
                        .update(cleanContract)
                        .eq('id', contract.id)
                        .select()
                        .single();

                    if (error) throw error;
                    return this.normalizeContract(data);
                } else {
                    // Generate sequential contract number if missing
                    if (!cleanContract.contract_number) {
                        const nextNumber = await this.getNextContractNumber();
                        cleanContract.contract_number = 'WT' + String(nextNumber).padStart(8, '0');
                    }

                    // Create new
                    const { data, error } = await supabaseClient
                        .from(this.TABLE_NAME)
                        .insert([cleanContract])
                        .select()
                        .single();

                    if (error) throw error;
                    return this.normalizeContract(data);
                }
            } catch (error) {
                console.error('Supabase save error:', error);
                alert('خطأ في حفظ البيانات: ' + error.message);
                throw error;
            }
        }
        return this.saveContractToLocal(contract);
    }

    // Delete contract
    static async deleteContract(id) {
        if (this.isSupabaseAvailable()) {
            try {
                const { error } = await supabaseClient
                    .from(this.TABLE_NAME)
                    .delete()
                    .eq('id', id);

                if (error) throw error;
            } catch (error) {
                console.error('Supabase delete error:', error);
                throw error;
            }
        } else {
            this.deleteContractFromLocal(id);
        }
    }

    // Normalize Supabase data to camelCase
    static normalizeContract(contract) {
        if (!contract) return null;

        // Handle contract_type - check for null, undefined, or empty string
        let contractType = 'تعاقد أجير'; // default
        if (contract.contract_type && contract.contract_type.trim() !== '') {
            contractType = contract.contract_type;
        } else if (contract.contractType && contract.contractType.trim() !== '') {
            contractType = contract.contractType;
        }

        return {
            id: contract.id,
            contractType: contractType,
            contractNumber: contract.contract_number || contract.contractNumber,
            workerName: contract.worker_name || contract.workerName,
            workerProfession: contract.worker_profession || contract.workerProfession,
            workerIdNumber: contract.worker_id_number || contract.workerIdNumber,
            workerNationality: contract.worker_nationality || contract.workerNationality,
            providerEntity: contract.provider_entity || contract.providerEntity,
            providerHrId: contract.provider_hr_id || contract.providerHrId,
            beneficiaryEntity: contract.beneficiary_entity || contract.beneficiaryEntity,
            beneficiaryHrId: contract.beneficiary_hr_id || contract.beneficiaryHrId,
            contractSummary: contract.contract_summary || contract.contractSummary,
            startDate: contract.start_date || contract.startDate,
            endDate: contract.end_date || contract.endDate,
            workLocations: contract.work_locations || contract.workLocations,
            isBlocked: contract.is_blocked || contract.isBlocked || false,
            blockedReason: contract.blocked_reason || contract.blockedReason || null,
            createdAt: contract.created_at || contract.createdAt
        };
    }

    // LocalStorage Fallback Methods
    static getContractsFromLocal() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    static getContractFromLocal(id) {
        const contracts = this.getContractsFromLocal();
        return contracts.find(c => c.id === id);
    }

    static saveContractToLocal(contract) {
        const contracts = this.getContractsFromLocal();

        if (contract.id) {
            const index = contracts.findIndex(c => c.id === contract.id);
            if (index !== -1) {
                contracts[index] = { ...contracts[index], ...contract };
            } else {
                contracts.push(contract);
            }
        } else {
            contract.id = this.generateId();
            contract.createdAt = new Date().toISOString();
            if (!contract.contractNumber) {
                // Get next sequential number from localStorage
                const nextNumber = this.getNextLocalContractNumber(contracts);
                contract.contractNumber = 'WT' + String(nextNumber).padStart(8, '0');
            }
            contracts.push(contract);
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(contracts));
        return contract;
    }

    static deleteContractFromLocal(id) {
        let contracts = this.getContractsFromLocal();
        contracts = contracts.filter(c => c.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(contracts));
    }

    static generateId() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Get next sequential contract number from Supabase
    static async getNextContractNumber() {
        try {
            const { data, error } = await supabaseClient
                .from(this.TABLE_NAME)
                .select('contract_number')
                .order('created_at', { ascending: false })
                .limit(1);

            if (error) throw error;

            if (data && data.length > 0 && data[0].contract_number) {
                // Extract number from "WT00000001" format
                const lastNumber = parseInt(data[0].contract_number.replace('WT', '')) || 0;
                return lastNumber + 1;
            }
            return 1; // First contract
        } catch (error) {
            console.error('Error getting next contract number:', error);
            return Date.now(); // Fallback to timestamp
        }
    }

    // Get next sequential contract number from localStorage
    static getNextLocalContractNumber(contracts) {
        if (!contracts || contracts.length === 0) return 1;

        let maxNumber = 0;
        contracts.forEach(c => {
            if (c.contractNumber) {
                const num = parseInt(c.contractNumber.replace('WT', '')) || 0;
                if (num > maxNumber) maxNumber = num;
            }
        });
        return maxNumber + 1;
    }
}

// Utility to format dates
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Common UI functions
function showToast(message, type = 'success') {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: type,
            title: message,
            showConfirmButton: false,
            timer: 3000
        });
    } else {
        alert(message);
    }
}

// Show database status on page load
window.addEventListener('DOMContentLoaded', () => {
    if (StorageManager.isSupabaseAvailable()) {
        console.log('🌐 Supabase Mode: Active');
    } else {
        console.log('💾 LocalStorage Mode: Active');
    }
});
