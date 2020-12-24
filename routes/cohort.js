const express = require('express');
const knex = require('../db/client');
const router = express.Router();


router.get('/team_picker',(req,res) => { // localhost:5000/team_picker
    res.render('cohort/home');
});

// new cohort
router.get('/new',(req,res) => { // /new
    res.render('cohort/new');
});

// inserting datas into table
router.post('/new', (req,res) => {
    knex('cohorts')
    .insert({
      logo_url: req.body.logo_url,
      name: req.body.name,
      members: req.body.members
    })
    .returning('*')
    .then(cohorts => {
      res.redirect('/index'); 
    });
});

// index page
router.get('/index',(req,res) => { // /index
    knex('cohorts')
    .orderBy('created_at', 'desc') 
    .then(cohort => {
      res.render('cohort/index', { cohort : cohort });
    });
});

//show cohort
router.get('cohort/:id', (req,res) => { // cohort/2
    knex('cohorts')
    .where('id', req.params.id)
    .first()
    .then(cohort => {
         res.render('cohort/show', { cohort : cohort });
    });
});

router.post('cohort/:id', (req,res) => {
    quantity = req.body.quantity;
    team_count=req.body.count;
    num_per_team=req.body.num_per_team;
});








module.exports = router;