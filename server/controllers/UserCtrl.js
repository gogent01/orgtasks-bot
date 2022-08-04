const mongoose = require('mongoose');
const User = require('../models/user');

const exists = async (tg_id, role) => !!await User.countDocuments({ tg_id: tg_id.toString().trim(), role });

exports.teacherExists = async (tg_id) => await exists.call(this, tg_id, 'teacher');
exports.studentExists = async (tg_id) => await exists.call(this, tg_id, 'student');
exports.parentExists = async (tg_id) => await exists.call(this, tg_id, 'parent');
exports.inspectorExists = async (tg_id) => await exists.call(this, tg_id, 'inspector');

exports.getStudentByFullName = async (name, surname) => {
  const straight = await User.findOne({ name, surname, role: 'student' })
    .catch(err => {
      console.log(err);
      return 0;
    });

  if (!straight) {
    return await User.findOne({ name: surname, surname: name, role: 'student' })
      .catch(err => {
        console.log(err);
        return 0;
      });
  }

  return straight;
};


const create = async (role, tg_id, name, surname, options) => {
  return await User.create({ role, tg_id, name, surname, options })
    .catch(err => {
        console.log(err);
        return 0;
      });
};

exports.createTeacher = async (tg_id, name, surname, options) => await create.call(this, 'teacher', tg_id, name, surname, options);
exports.createStudent = async (tg_id, name, surname) => await create.call(this, 'student', tg_id, name, surname, { parents: [] });
exports.createParent = async (tg_id, name, surname, options) => await create.call(this, 'parent', tg_id, name, surname, options);
exports.createInspector = async (tg_id, name, surname) => await create.call(this, 'inspector', tg_id, name, surname, { classes: [] });

const get = async (tg_id, role) => {
  return await User.findOne({ tg_id, role })
    .catch(err => {
      console.log(err);
      return 0;
    });
};

exports.getStudent = async (tg_id) => await get.call(this, tg_id, 'student');
exports.getParent = async (tg_id) => await get.call(this, tg_id, 'parent');

exports.updateResultsChatId = async(tg_id, chat_id) => {
  return await User.findOneAndUpdate({ tg_id, role: 'student' }, { $set: { 'options.resultsChatId': chat_id } } )
    .catch(err => {
      console.log(err);
      return 0;
    });
};

exports.addParent = async (parentId, studentId) => {
  const student = await User.findOne({ tg_id: studentId, role: 'student' })
    .catch(err => {
      console.log(err);
      return 0;
    });

  if (student) {
    const parents = student.options.parents || [];
    parents.push(parentId.toString());

    return await User.findOneAndUpdate({ tg_id: studentId, role: 'student' }, { $set: { 'options.parents': parents } } )
      .catch(err => {
        console.log(err);
        return 0;
      });
  }

  return 0;
};


exports.addClassToInspector = async (classId, inspectorId) => {
  const { options } = await User.findOne({ tg_id: inspectorId.toString(), role: 'inspector' });
  options.classes = [...options.classes, mongoose.Types.ObjectId(classId)];

  return await User.findOneAndUpdate({ tg_id: inspectorId.toString(), role: 'inspector' }, { $set: { options } })
    .catch(err => {
      console.log(err);
      return 0;
    });
};

exports.createReports = async () => {

};
