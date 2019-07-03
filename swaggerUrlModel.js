const baseModel = require('models/base.js');

class swaggerUrlModel extends baseModel {
  getName() {
    return 'import-swagger-url-model';
  }

  getSchema() {
    return {
      projectId: { type: Number, required: true },
      swaggerUrl: { type: String, required: true }
    };
  }

  getByProjectId(projectId) {
    return this.model.findOne({
      projectId: projectId
    });
  }

  save(data) {
    let m = new this.model(data);
    return m.save();
  }

  up(data) {
    let id = data._id;
    delete data._id;
    return this.model.update({
      _id: id
    }, data)
  }
}

module.exports = swaggerUrlModel;
