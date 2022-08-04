const Session = require('../models/session');

exports.setState = async (tg_id, state) => {
  const data = await Session.findOneAndUpdate({ tg_id }, { state }, { upsert: true, new: true })
    .catch(err => {
      console.log(err);
      return 0;
    });

  return data.state;
};

exports.getState = async (tg_id) => {
  const data = await Session.findOne({ tg_id })
    .catch(err => {
      console.log(err);
      return 0;
    });

  if (!data || !data._doc.hasOwnProperty('state')) return {};

  return data.state;
};
