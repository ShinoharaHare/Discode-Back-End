const { auth } = require('@common/middlewares');

const router = require('express').Router();

router.use(auth);

//用來獲得某頻道的歷史訊息
router.get('/', (req, res) => {
    // res.json({
    //     success: true,
    //     messages: [{ 
            
    //     }]
    // });
});

//用來發送某頻道的訊息
router.post('/', (req, res) => {
    
});


module.exports = {
    path: 'message',
    router: router
};