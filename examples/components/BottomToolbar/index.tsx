import { ThemeProvider, darkTheme, EditorProps } from '@react-page/editor';
import { Divider, Portal } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import React from 'react';
import Content from './Content';

type BottomToolbarComponent = EditorProps['components']['BottomToolbar'];

const darkBlack = 'rgba(0, 0, 0, 0.87)';
const bright = 'rgba(255,255,255, 0.98)';
const brightBorder = 'rgba(0, 0, 0, 0.12)';
const SIZES = [1, 0.8, 0.6, 1.2];
let lastSize = SIZES[0]; // poor mans redux

const BottomToolbar: BottomToolbarComponent = ({
  open = false,
  children,
  className,
  dark = false,
  theme,
  anchor = 'bottom',
  nodeId,
}) => {
  const [size, setSize] = React.useState(lastSize);
  const toggleSize = React.useCallback(() => {
    const newSize = SIZES[(SIZES.indexOf(size) + 1) % SIZES.length];
    setSize(newSize);
    // poor man's redux
    lastSize = newSize;
  }, [size, setSize]);

  const [collapsed, setCollapsed] = React.useState(false);
  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((collapsed) => !collapsed);
  }, [setCollapsed]);

  return (
    <Portal>
      <ThemeProvider theme={theme ? theme : dark ? darkTheme : null}>
        <Drawer
          SlideProps={{
            mountOnEnter: true,
            unmountOnExit: true,
          }}
          variant="persistent"
          className={className}
          open={open}
          anchor={anchor}
          PaperProps={{
            style: {
              zIndex: 10,
              backgroundColor: 'transparent',
              border: 'none',
              overflow: 'visible',
              pointerEvents: 'none',
            },
          }}
        >
          <div
            style={{
              pointerEvents: 'all',
              border: `${dark ? darkBlack : brightBorder} 1px solid`,
              borderRadius: '4px 4px 0 0',
              backgroundColor: dark ? darkBlack : bright,
              padding: '12px 24px',

              margin: 'auto',
              boxShadow: '0px 1px 8px -1px rgba(0,0,0,0.4)',
              position: 'relative',
              minWidth: '50vw',
              maxWidth: 'calc(100vw - 220px)',
              transformOrigin: 'bottom',
              transform: `scale(${size})`,
              transition: '0.3s',
            }}
          >
            {collapsed ? null : children}
            <Divider
              style={{
                marginLeft: -24,
                marginRight: -24,
                marginTop: 12,
                marginBottom: 12,
              }}
            />

            <Content
              nodeId={nodeId}
              toggleSize={toggleSize}
              collapsed={collapsed}
              toggleCollapsed={toggleCollapsed}
            />
          </div>
        </Drawer>
      </ThemeProvider>
    </Portal>
  );
};

export default React.memo(BottomToolbar);
