# [drag-selection](https://www.npmjs.com/package/drag-selection)

基于react的框选组件。

## Usage

```sh
npm install drag-selection
```
```less
  .container {
    height: 430px;
    overflow-y: auto;
    background: #f5f5f5;
    display: grid;
    gap: 10px;
    justify-content: center;
    grid-template-columns: repeat(auto-fill, 100px);
    grid-template-rows: repeat(auto-fill, 100px);
    .node {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
      background: #e5e5e5;
    }
    .highlight {
      background: #a5a5a5;
      color: #fff;
    }
  }
```
```jsx
        const nodeIds = range(1,31);
        return (<DragSelection 
                 onSelectionMove={({ left, top, width, height }) => {
                    if (width > 10 && height > 10) {
                    // 要有一定的移动量才计算框选，不然很容易误点
                    nodeIds.forEach(nodeId => {
                        const element = document.getElementById(nodeId);
                        if (element) {
                        const rect = element.getBoundingClientRect();
                        if (
                            left <= rect.left + rect.width &&
                            left + width >= rect.left &&
                            top <= rect.top + rect.height &&
                            top + height >= rect.top
                        ) {
                            element.classList.add(styles.highlight)
                        }else{
                            element.classList.remove(styles.highlight)
                        }
                        }
                    });
                    }
              }}>
               <div className={styles.container}>
                  {nodeIds.map(nodeId=><div id={`${nodeId}`} className={styles.node}>{nodeId+1}</div>)}
               </div>
              </DragSelection>)
```
## RUN EFFECT
![image](https://github.com/lth707/drag-selection/blob/master/run.gif)

## LICENSE

MIT
