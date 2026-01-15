const router = require('express').Router();
const {
    createRefundPolicy,
    getAllRefundPolicy,
    updateRefundPolicy,
    deleteRefundPolicy,
    getAllRefundPolicyAdmin
} = require('../../controllers/newControllers/refundPolicy');
const { adminTokenVerify, tokenVerify } = require('../../common/tokenVerify');

router.post('/', adminTokenVerify, createRefundPolicy);
router.get('/', tokenVerify, getAllRefundPolicy);
router.get('/admin', adminTokenVerify, getAllRefundPolicyAdmin);
router.put('/:id', adminTokenVerify, updateRefundPolicy);
router.delete('/:id', adminTokenVerify, deleteRefundPolicy);

module.exports = router;
