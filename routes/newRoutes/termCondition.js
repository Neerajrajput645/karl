const router = require('express').Router();
const {
    createTermCondition,
    getAllTermCondition,
    updateTermCondition,
    deleteTermCondition,
    getAllTermConditionAdmin
} = require('../../controllers/newControllers/termCondition');
const { adminTokenVerify, tokenVerify } = require('../../common/tokenVerify');

router.post('/', adminTokenVerify, createTermCondition);
router.get('/', tokenVerify, getAllTermCondition);
router.get('/admin', adminTokenVerify, getAllTermConditionAdmin);
router.put('/:id', adminTokenVerify, updateTermCondition);
router.delete('/:id', adminTokenVerify, deleteTermCondition);

module.exports = router;
