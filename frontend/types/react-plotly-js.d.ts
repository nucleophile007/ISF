declare module "react-plotly.js" {
    import { Component } from "react";
    import { PlotData, Layout, Config, PlotMouseEvent, PlotSelectionEvent } from "plotly.js";
  
    interface PlotProps {
      data: Partial<PlotData>[];
      layout?: Partial<Layout>;
      config?: Partial<Config>;
      style?: React.CSSProperties;
      className?: string;
      onClick?: (event: Readonly<PlotMouseEvent>) => void;
      onSelected?: (event: Readonly<PlotSelectionEvent>) => void;
      onHover?: (event: Readonly<PlotMouseEvent>) => void;
      onUnhover?: (event: Readonly<PlotMouseEvent>) => void;
      useResizeHandler?: boolean;
      revision?: number;
    }
  
    export default class Plot extends Component<PlotProps> {}
  }