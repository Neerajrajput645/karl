const router = require('express').Router();
const {
    createAboutUs,
    getAllAboutUs,
    updateAboutUs,
    deleteAboutUs,
    getAllAboutUsAdmin
} = require('../../controllers/newControllers/aboutUs');
const { adminTokenVerify, tokenVerify } = require('../../common/tokenVerify');

router.post('/', adminTokenVerify, createAboutUs);
router.get('/', tokenVerify, getAllAboutUs);
router.get('/admin', adminTokenVerify, getAllAboutUsAdmin);
router.put('/:id', adminTokenVerify, updateAboutUs);
router.delete('/:id', adminTokenVerify, deleteAboutUs);

module.exports = router;
