import * as React from 'react';
import { StickyContainer, Sticky } from 'components/Sticky';

const StickyHeader = () => {
    return (
        <StickyContainer>
          <Sticky>
            {
              ({
                style
              }: {style: any}) => {
                return (
                  <header style={style}>
                    Hello world
                  </header>
                )
              }
            }
          </Sticky>
        </StickyContainer>
      );
}

export default StickyHeader;
