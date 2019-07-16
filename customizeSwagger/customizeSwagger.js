import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Radio, Select, Input, message, Tooltip, Icon } from 'antd';
import axios from 'axios';
import './customizeSwagger.scss';

const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(
  state => {
    return {
      projectMsg: state.project.currProject
    };
  },
  {}
)
export default class ProjectInterfaceSync extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 项目所有接口list
      interfaceList: [],
      // 导入接口的方式
      importType: 'add',
      // 项目的swagger json地址
      swaggerUrl: '',
      // 是否已有url
      hasUrl: false,
      // 新增或更新接口arr
      interfaceName: [],
      // 更新接口接口名输入形式
      inputType: 'select',
      _id: null
    };
  }
   
  static propTypes = {
    projectId: PropTypes.number,
    handleSwaggerUrlData: PropTypes.func,
    projectMsg: PropTypes.object,
    swaggerUrlData: PropTypes.string
  };

  componentDidMount() {
    this.getSwaggerUrl();
  }
  // 获取是否存在swaggerUrl
  getSwaggerUrl = () => {
    const params = {
      projectId: this.props.projectId
    }
    axios.post('/api/plugin/customizeSwagger/getSwaggerUrl', params).then(res => {
      const { errcode, data, errmsg } = res.data
      if (errcode === 0) {
        if (data) {
          const { swaggerUrl, _id } = data
          this.setState({
            swaggerUrl,
            hasUrl: true,
            _id
          })
        }
      } else {
        message.error(errmsg);
      }
    });
  }
  // 保存swaggerUrl
  saveSwaggerUrl = () => {
    const { swaggerUrl, _id } = this.state
    const params = {
      projectId: this.props.projectId,
      swaggerUrl,
      _id
    }
    axios.post('/api/plugin/customizeSwagger/saveSwaggerUrl', params).then(res => {
      const { errcode, errmsg } = res.data
      if (errcode === 0) {
        message.success(errmsg);
        this.setState({
          hasUrl: true
        })
      } else {
        message.error(errmsg);
      }
    });
  }
  // 获取项目所有接口list
  getInterfaceList = () => {
    const {  projectMsg = {} } = this.props 
    const { basepath = '' } = projectMsg
    axios.get(`/api/interface/list_menu?project_id=${this.props.projectId}`).then(res => {
      const { errcode, data, errmsg } = res.data
      if (errcode === 0) {
        let interfaceList = [];
        data.forEach(controller => {
          controller.list.forEach(item => {
            let path = item.path
            // 处理baseUrl
            if (basepath) {
              path = item.path.indexOf(basepath) === 0 ? item.path.substr(basepath.length) : path;
              path = `${basepath}${path}`
            }
            interfaceList.push(path)
          })
        });
        this.setState({
          interfaceList
        });
      } else {
        message.error(errmsg);
      }
    });
  }

  changeSwaggerUrl = () => {
    this.setState({
      hasUrl: false,
      swaggerUrl: ''
    });
  }
  importTypeChange = e => {
    const importType = e.target.value;
    this.setState({
      importType
    });
    importType === 'update' && this.state.interfaceList.length === 0 && this.getInterfaceList();
  };

  inputTypeChange = e => {
    this.setState({
      inputType: e.target.value
    });
  };

  swaggerUrlInput = e => {
    this.setState({
      swaggerUrl: String(e.target.value).trim()
    });
  };

  interfaceNameInput = e => {
    const arr = e.target.value.split(',')
    this.setState({
      interfaceName: arr.map(item => item.trim())
    });
  };

  interfaceSelect = value => {
    this.setState({
      interfaceName: value
    });
  };

  importData = async () => {
    const { importType, swaggerUrl, interfaceName } = this.state
    const { projectId, projectMsg = {} } = this.props 

    if (!swaggerUrl) {
      return message.error('swagger url 不能为空!');
    }
    const params = {
      importType,
      projectId,
      cat: projectMsg.cat,
      interfaceName,
      swaggerUrl
    }
    await axios.post('/api/plugin/customizeSwagger/updateData', params).then(res => {
      const { errcode, errmsg } = res.data
      if (errcode === 0) {
        message.success(errmsg);
      } else {
        message.error(errmsg);
      }
    });
  };

  render() {
    const { importType, inputType, interfaceList, swaggerUrl, hasUrl } = this.state
    return (
      <div className="appiont-swagger-data">
        <div className="card">
          <RadioGroup onChange={this.importTypeChange} value={importType}>
            <Radio value="add">添加接口</Radio>
            <Radio value="update">更新接口</Radio>
          </RadioGroup>
          <div className="import-label">项目的swaggerUrl:</div>
          {hasUrl ? (
            <div className="swagger-url">
              {swaggerUrl}
              <Button className="url-button" type="primary" onClick={this.changeSwaggerUrl}>修改</Button>
            </div>
          ) : (
            <div className="swagger-url">
              <Input
                placeholder="http://demo.swagger.io/v2/swagger.json"
                onChange={this.swaggerUrlInput}
              />
              <Button className="url-button" type="primary" onClick={this.saveSwaggerUrl}>保存</Button>
            </div>
          )}
          <div className="import-label">接口名称&nbsp;
            <Tooltip
              title={
                <div>
                  <p>1、添加多个接口时请用,隔开</p>
                  <p>2、接口名称必须和后端定义的一致</p>
                  <p>3、项目接口过多时，更新接口请选择直接输入接口名称</p>
                </div>
              }
            >
              <Icon type="question-circle-o" />
            </Tooltip>{' '}：</div>
          {importType === 'add' ? (
            <Input
              placeholder="/api/interface/add"
              onChange={this.interfaceNameInput}
            /> 
          ) : (
            <div>
              <div className="input-radio">
                <RadioGroup onChange={this.inputTypeChange} value={inputType}>
                  <Radio value="select">选择接口名称</Radio>
                  <Radio value="input">输入接口名称</Radio>
                </RadioGroup>
              </div>
              {inputType === 'select' ? (
                <Select
                className="import-select"
                mode="multiple"
                onChange={this.interfaceSelect}
                placeholder="/api/interface/add"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {interfaceList.map((item, key) => <Option key={key} value={item}>{item}</Option>)}
                </Select>
              ) : (
                <Input
                  placeholder="/api/interface/add"
                  onChange={this.interfaceNameInput}
                /> 
              )}
            </div>
          )}
          <Button className="import-button" type="primary" onClick={this.importData}>导入</Button>
        </div>
      </div>
    );
  }
}
