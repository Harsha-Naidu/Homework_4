const express = require('express');
const knex = require('../db/client');
const router = express.Router();


router.get('/team_picker',(req,res) => { // localhost:5000/team_picker
    res.render('cohort/home');
});

// new cohort
router.get('/new',(req,res) => { // /new
    res.render('cohort/new', {cohort:false});
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
    .then(() => {
      res.redirect('/index'); 
    });
});

// index page
router.get('/index',(req,res) => { // /index
    knex('cohorts')
   .orderBy('created_at', 'desc') 
   .then(cohort => {
      res.render('cohort/index', { cohort : cohort});
   });
});

//show cohort
router.get('/cohort/:id', (req,res) => { // cohort/2
    knex('cohorts')
    .where('id', req.params.id)
    .first()
    .then(cohort => {
         res.render('cohort/show', { cohort : cohort,teamSplit : false });
    });
});

//assign teams
router.post('/cohort/:id', (req,res) => {
  // Team_count
  knex('cohorts')
  .where('id',req.params.id)
  .first()
  .then(cohort =>{
    quantity = req.body.quantity;
    members = cohort.members;
    value = req.body.team_split;
    
    const array = members.split(',');
    rows = Math.ceil(array.length/quantity);

    function teamCount(arr,n) { 
      teams = [] 
      while (n > 0) { 
         teams.push(arr.splice(0, Math.floor(arr.length/n))) 
         n--  
        } 
         return teams
      }

      function numPerTeam(array,quantity,rows)
      {
        split=[]
        while(rows > 0){
        split.push(array.splice(0,quantity));
        rows--;
        }
        return split;
      }
      
      if(value === "team_count")
      {
         teamSplit = teamCount(array,quantity);
      }
      else { 
         teamSplit = numPerTeam(array,quantity,rows);  
      }
      res.render('cohort/show',{cohort : cohort, teamSplit : teamSplit});  
     });
})

// EDIT
router.get('/:id/edit', (req, res) => {
    knex('cohorts')
      .where('id', req.params.id)
      .first()
      .then(cohort => {
        res.render('cohort/edit', { cohort : cohort });
      });
  });

  // UPDATE
router.patch('/:id', (req, res) => {
    knex('cohorts')
      .where('id', req.params.id)
      .update({
        logo_url: req.body.logo_url,
        name: req.body.name,
        members: req.body.members
      })
      .then(() => {
        res.redirect(`/cohort/${req.params.id}`); // cohort/2
      });
  })


// DELETE 
router.delete('/:id', (req, res) => {
    knex('cohorts')
      .where('id', req.params.id)
      .del()
      .then(() => {
        res.redirect('/index');
      });
  });

module.exports = router;