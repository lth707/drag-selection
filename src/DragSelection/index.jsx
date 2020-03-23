import React, { Component } from 'react';
import { noop, isNull } from 'lodash-es';
import PropTypes from 'prop-types';
import classnames from '../common/classnames';
import RenderToBody from '../components/RenderToBody';
import styles from './index.less';

const cx = classnames(styles);
class DragSelection extends Component {
  constructor() {
    super();
    this.containerRef = React.createRef();
    this.selectionBorderRef = React.createRef();
    this.state = {
      isMouseDown: false,
      isMouseLeave: false,
      startPoint: null,
      endPoint: null,
      selectionBoxStyle: null,
    };
  }

  onMouseMove = e => {
    e.preventDefault();
    const { isMouseDown, startPoint, isMouseLeave } = this.state;
    if (isMouseDown && !isMouseLeave) {
      const endPoint = {
        x: e.clientX,
        y: e.clientY,
      };
      this.setState(
        {
          endPoint,
          selectionBoxStyle: this.calculateSelectionBox(startPoint, endPoint),
        },
        () => {
          const { onSelectionMove } = this.props;
          if (onSelectionMove && this.selectionBorderRef && this.selectionBorderRef.current) {
            onSelectionMove(this.selectionBorderRef.current.getBoundingClientRect());
          }
        },
      );
    }
  };

  onMouseDown = e => {
    const { enabled } = this.props;
    if (!enabled) {
      return;
    }
    const nextState = {};
    nextState.isMouseDown = true;
    nextState.isMouseLeave = false;
    nextState.startPoint = {
      x: e.clientX,
      y: e.clientY,
    };
    this.setState(nextState);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  onMouseUp = () => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    const { onSelectionEnd } = this.props;
    if (this.selectionBorderRef && this.selectionBorderRef.current) {
      onSelectionEnd(this.selectionBorderRef.current.getBoundingClientRect());
    }
    this.setState({
      isMouseDown: false,
      isMouseLeave: false,
      startPoint: null,
      endPoint: null,
      selectionBoxStyle: null,
    });
  };

  getScroll(node) {
    let scrollLeft = 0;
    let scrollTop = 0;
    let { parentNode } = node || {};
    if (!node && !parentNode) {
      return {
        scrollLeft,
        scrollTop,
      };
    }
    while (parentNode) {
      scrollLeft += parentNode.scrollLeft || 0;
      scrollTop += parentNode.scrollTop || 0;
      parentNode = parentNode.parentNode;
    }
    return {
      scrollLeft,
      scrollTop,
    };
  }

  calculateSelectionBox = (startPoint, endPoint) => {
    const { isMouseDown } = this.state;
    if (!isMouseDown || isNull(endPoint) || isNull(startPoint)) {
      return null;
    }
    const parentNode = this.containerRef.current;
    const rect = parentNode.getBoundingClientRect();
    const scroll = this.getScroll(parentNode);
    const left = Math.min(startPoint.x, endPoint.x) + scroll.scrollLeft;
    const top = Math.min(startPoint.y, endPoint.y) + scroll.scrollTop;
    const width = Math.min(rect.width, Math.abs(startPoint.x - endPoint.x));
    const height = Math.min(rect.height, Math.abs(startPoint.y - endPoint.y));
    return {
      left,
      top,
      width,
      height,
    };
  };

  renderSelectionBox = () => {
    const { isMouseDown, endPoint, startPoint, selectionBoxStyle } = this.state;
    return (
      <RenderToBody
        style={selectionBoxStyle}
        visible={isMouseDown && !isNull(endPoint) && !isNull(startPoint)}
      >
        <div ref={this.selectionBorderRef} className={cx('selection-border')} />
      </RenderToBody>
    );
  };

  render() {
    const { children, className } = this.props;
    return (
      <div
        className={cx('container', `:${className || ''}`)}
        ref={this.containerRef}
        role="button"
        onMouseDown={this.onMouseDown}
        onMouseLeave={() => {
          this.setState({ isMouseLeave: true });
        }}
      >
        {children}
        {this.renderSelectionBox()}
      </div>
    );
  }
}

DragSelection.propTypes = {
  enabled: PropTypes.bool,
  onSelectionEnd: PropTypes.func,
  onSelectionMove: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
};

DragSelection.defaultProps = {
  enabled: true,
  onSelectionEnd: noop,
};

export default DragSelection;
