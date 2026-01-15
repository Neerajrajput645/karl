const router = require('express').Router();
const {
    createPrivacyPolicy,
    getAllPrivacyPolicy,
    updatePrivacyPolicy,
    deletePrivacyPolicy,
    getAllPrivacyPolicyAdmin
} = require('../../controllers/newControllers/privacyPolicy');
const { adminTokenVerify, tokenVerify } = require('../../common/tokenVerify');

router.post('/', adminTokenVerify, createPrivacyPolicy);
router.get('/', tokenVerify, getAllPrivacyPolicy);
router.get('/admin', adminTokenVerify, getAllPrivacyPolicyAdmin);
router.put('/:id', adminTokenVerify, updatePrivacyPolicy);
router.delete('/:id', adminTokenVerify, deletePrivacyPolicy);

module.exports = router;
