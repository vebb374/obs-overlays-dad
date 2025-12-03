import React, { Suspense } from 'react';
import { type OverlayComponent, type Theme } from '../../state/useOverlayStore';

const MarqueeTicker = React.lazy(() => import('./MarqueeTicker').then(module => ({ default: module.MarqueeTicker })));
const WeeklyJournalCard = React.lazy(() => import('./WeeklyJournalCard').then(module => ({ default: module.WeeklyJournalCard })));
const MediaComponent = React.lazy(() => import('./MediaComponent').then(module => ({ default: module.MediaComponent })));

interface Props {
  component: OverlayComponent;
  theme: Theme;
}

export const OverlayComponentRenderer: React.FC<Props> = ({ component, theme }) => {
  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white/20">Loading...</div>}>
      <ComponentContent component={component} theme={theme} />
    </Suspense>
  );
};

const ComponentContent: React.FC<Props> = ({ component, theme }) => {
  switch (component.type) {
    case 'marquee':
      return (
        <MarqueeTicker 
          text={component.props.text}
          speed={component.props.speed}
          separator={component.props.separator}
          fontFamily={component.props.fontFamily}
          width={component.width} 
          height={component.height} 
          theme={theme} 
        />
      );
    case 'journal':
      return (
        <WeeklyJournalCard 
          data={component.props.data}
          heading={component.props.heading}
          subHeading={component.props.subHeading}
          showTotal={component.props.showTotal}
          fontFamily={component.props.fontFamily}
          width={component.width} 
          height={component.height} 
          theme={theme} 
        />
      );
    case 'media':
      return (
        <MediaComponent 
           src={component.props.src}
           objectFit={component.props.objectFit}
           width={component.width}
           height={component.height}
        />
      );
    default:
      return null;
  }
};
