/**
 * Sample Data for Ajeer Contracts
 * بيانات تجريبية لنظام عقود أجير
 */

const SAMPLE_CONTRACTS = [
    {
        contractNumber: 'WT12345678',
        workerName: 'محمد أحمد علي',
        workerProfession: 'عامل نظافة',
        workerIdNumber: '2234567890',
        workerNationality: 'مصري',
        providerEntity: 'شركة الخدمات المتقدمة',
        providerHrId: '700123456',
        beneficiaryEntity: 'مستشفى الملك فيصل',
        beneficiaryHrId: '700987654',
        contractSummary: 'عقد عمل لتقديم خدمات النظافة في المستشفى',
        startDate: '2024-01-15',
        endDate: '2025-01-14',
        workLocations: 'مستشفى الملك فيصل - الرياض'
    },
    {
        contractNumber: 'WT87654321',
        workerName: 'عبدالله حسن محمود',
        workerProfession: 'سائق',
        workerIdNumber: '2345678901',
        workerNationality: 'سوداني',
        providerEntity: 'مؤسسة النقل الحديث',
        providerHrId: '700234567',
        beneficiaryEntity: 'شركة البتروكيماويات',
        beneficiaryHrId: '700876543',
        contractSummary: 'عقد قيادة ونقل الموظفين',
        startDate: '2024-03-01',
        endDate: '2025-02-28',
        workLocations: 'الجبيل الصناعية'
    },
    {
        contractNumber: 'WT11223344',
        workerName: 'أحمد عبدالرحمن',
        workerProfession: 'فني صيانة',
        workerIdNumber: '2456789012',
        workerNationality: 'يمني',
        providerEntity: 'شركة الصيانة الشاملة',
        providerHrId: '700345678',
        beneficiaryEntity: 'مجمع العثيم التجاري',
        beneficiaryHrId: '700765432',
        contractSummary: 'صيانة أنظمة التكييف والكهرباء',
        startDate: '2024-06-01',
        endDate: '2025-05-31',
        workLocations: 'مجمع العثيم - الدمام'
    }
];

/**
 * Load sample data to Firebase or LocalStorage
 */
async function loadSampleData() {
    try {
        console.log('🔄 جاري تحميل البيانات التجريبية...');

        let addedCount = 0;

        for (const contract of SAMPLE_CONTRACTS) {
            await StorageManager.saveContract({...contract});
            addedCount++;
            console.log(`✅ تم إضافة العقد ${addedCount}/${SAMPLE_CONTRACTS.length}`);
        }

        console.log(`🎉 تم تحميل ${addedCount} عقود تجريبية بنجاح!`);
        alert(`✅ تم تحميل ${addedCount} عقود تجريبية!\nسيتم تحديث الصفحة الآن...`);

        setTimeout(() => {
            window.location.reload();
        }, 1000);

    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        alert('حدث خطأ في تحميل البيانات التجريبية');
    }
}

/**
 * Clear all contracts (للتجربة فقط - خطر!)
 */
async function clearAllContracts() {
    if (!confirm('⚠️ هل أنت متأكد من حذف جميع العقود؟\nهذا الإجراء لا يمكن التراجع عنه!')) {
        return;
    }

    try {
        const contracts = await StorageManager.getContracts();

        for (const contract of contracts) {
            await StorageManager.deleteContract(contract.id);
        }

        // Clear localStorage too
        localStorage.removeItem(StorageManager.STORAGE_KEY);

        console.log('✅ تم حذف جميع العقود');
        alert('✅ تم حذف جميع العقود\nسيتم تحديث الصفحة...');

        setTimeout(() => {
            window.location.reload();
        }, 1000);

    } catch (error) {
        console.error('❌ خطأ في الحذف:', error);
        alert('حدث خطأ في حذف البيانات');
    }
}

// Make functions available globally
window.loadSampleData = loadSampleData;
window.clearAllContracts = clearAllContracts;

console.log('💡 للتجربة: اكتب في Console:');
console.log('   loadSampleData()     - لإضافة 3 عقود تجريبية');
console.log('   clearAllContracts()  - لحذف جميع العقود');
