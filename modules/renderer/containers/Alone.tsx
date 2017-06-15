import * as React from 'react'
import { connect } from 'react-redux'
import ImageOptions from '../components/ImageOptions'
import ImageViewer from '../components/ImageViewer'
import Modal from '../components/Modal'
import Icon from '../components/Icon'
import SizeReduce from '../components/SizeReduce'
import { actions } from '../store/actions'
import { IState } from '../store/reducer'
import { getTaskById } from '../store/filter'
import { ITaskItem, IOptimizeOptions, TaskStatus } from '../../common/constants'

import './Alone.less'

interface IAloneProps {
  task: ITaskItem
}

interface IAloneDispatchProps {
  onClose(): void
  onOptionsChange(id: string, options: IOptimizeOptions): void
}

class Alone extends React.PureComponent<IAloneProps & IAloneDispatchProps, any> {
  handleOptionsChange = (options: IOptimizeOptions) => {
    this.props.onOptionsChange(this.props.task.id, options)
  }

  handleKeyPress = (e: KeyboardEvent) => {
    if (e.keyCode === 27) {
      this.props.onClose()
    }
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyPress)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyPress)
  }

  render() {
    const { task } = this.props
    const image = task && (task.optimized || task.image)

    return (
      <Modal className="alone-modal" visible={!!task} onClose={this.props.onClose}>
        <ImageViewer src={image && image.url} />
        {
          task ? (
            <div>
              { task.status === TaskStatus.PROCESSING || task.status === TaskStatus.PENDING
                ? <Icon className="-spin" name="color" />
                : null
              }
              <SizeReduce task={task} />
              <div className="paper alone-options">
                <ImageOptions ext={task.image.ext} options={task.options} onChange={this.handleOptionsChange} />
              </div>
            </div>
          ) : null
        }
      </Modal>
    )
  }
}

export default connect<IAloneProps, IAloneDispatchProps, {}>(state => ({
  task: state.globals.activeId && getTaskById(state.tasks, state.globals.activeId),
}), dispatch => ({
  onClose() {
    dispatch(actions.taskDetail(null))
  },
  onOptionsChange(id: string, options: IOptimizeOptions) {
    dispatch(actions.taskUpdateOptions(id, options))
  },
}))(Alone)
