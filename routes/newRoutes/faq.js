const router = require('express').Router();
const {
    createFaq,
    updateFaq,
    deleteFaq,
    listAllFaqs,
    listAllFaqsAdmin,
    getFaqDetails
} = require('../../controllers/newControllers/faq');
const { adminTokenVerify } = require('../../common/tokenVerify');
//=========================== Routes =====================================
router.post('/', adminTokenVerify, createFaq);
router.put('/:faqId', adminTokenVerify, updateFaq);
router.delete('/:faqId', adminTokenVerify, deleteFaq);
router.get('/', listAllFaqs);
router.get('/admin', adminTokenVerify, listAllFaqsAdmin);
router.get('/:faqId', getFaqDetails);

// ============================= Export ===================================
module.exports = router;