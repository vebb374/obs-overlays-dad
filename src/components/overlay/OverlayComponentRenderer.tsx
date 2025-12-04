import React, { Suspense } from 'react';
import type { Theme } from '../../types/theme';
import type { OverlayComponent } from '../../types/overlay';

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
  if (component.type === 'marquee') {
    return (
      <MarqueeTicker 
        key={theme.id}
        text={component.props.text}
        speed={component.props.speed}
        separator={component.props.separator}
        fontFamily={component.props.fontFamily}
        width={component.width} 
        height={component.height} 
        duration={component.duration}
        onscreenDuration={component.onscreenDuration}
        offscreenDuration={component.offscreenDuration}
        loop={component.loop}
        theme={theme} 
      />
    );
  }
  
  if (component.type === 'journal') {
    return (
      <WeeklyJournalCard 
        key={theme.id}
        data={component.props.data}
        heading={component.props.heading}
        subHeading={component.props.subHeading}
        showTotal={component.props.showTotal}
        fontFamily={component.props.fontFamily}
        width={component.width} 
        height={component.height} 
        duration={component.duration}
        onscreenDuration={component.onscreenDuration}
        offscreenDuration={component.offscreenDuration}
        loop={component.loop}
        theme={theme} 
      />
    );
  }
  
  if (component.type === 'media') {
    return (
      <MediaComponent 
         key={theme.id}
         src={component.props.src}
         objectFit={component.props.objectFit}
         width={component.width}
         height={component.height}
      />
    );
  }
  
  return null;
};
