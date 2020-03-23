import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from '../../common/classnames';
import styles from './RenderToBody.less';

const cx = classnames(styles, 'render-to-body');
class RenderToBody extends Component {
  constructor() {
    super();
    this.parentNode = document.createElement('div');
    document.body.appendChild(this.parentNode);
    this.parentNode.classList.add(cx('parent-node'));
  }

  componentWillUnmount() {
    document.body.removeChild(this.parentNode);
  }

  render() {
    const { children, left, top, visible, className, style } = this.props;
    return ReactDOM.createPortal(
      <div
        className={cx('wrap', `:${className || ''}`)}
        style={{ left, top, display: visible ? 'block' : 'none', ...style }}
      >
        {children}
      </div>,
      this.parentNode,
    );
  }
}

RenderToBody.propTypes = {
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  visible: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.shape({}),
};

export default RenderToBody;
