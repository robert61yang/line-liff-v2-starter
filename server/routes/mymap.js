const db = require('../db');
const express = require('express');
const router = express.Router();

// export our router to be mounted by the parent application
module.exports = router;

router.post('/add', async (req, res) => {
  const { name, place, time } = req.body;
  try { 
    const { rows } = await db.query('INSERT INTO campaign(name, place, time) VALUES($1, $2, $3) RETURNING *', [name, place, time]);
    res.send(rows[0]);
  } catch (error) {
    console.error(error.stack);
  }
});

router.get('/getmarks', async (req, res) => {
  const campaignId = req.params.id;
  try {
    let result = await db.query('SELECT * FROM markers');
    console.log(result);
    result = JSON.parse(result);
    res.send(
      result
    );
  } catch (error) {
    console.error(error.stack);
    res.send(error)
  }
});

router.post('/:id/join', async (req, res) => {
  const { uid, name, isJoin } = req.body;
  const campaignId = req.params.id;
  try {
    const { rows } = await db.query('SELECT * FROM member WHERE uid = $1 AND campaign_id = $2', [uid, campaignId]);
    const { rows: result } = rows.length > 0
      ? await db.query('UPDATE member SET is_join=$1 WHERE uid = $2 AND campaign_id = $3 RETURNING *', [isJoin, uid, campaignId])
      : await db.query('INSERT INTO member(uid, name, is_join, campaign_id) VALUES($1, $2, $3, $4) RETURNING *', [uid, name, isJoin, campaignId]);
    res.send(result[0]);
  } catch (error) {
    console.error(error.stack);
  }
});
