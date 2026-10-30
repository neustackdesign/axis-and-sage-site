import * as React from "react";
/** Stage for redrawn case artifacts: ArtifactScreen (phone outline) and ArtifactDoc (tilted A4 sheet with orange signature line). */
export interface ArtifactProps {
  /** Cloud-200 stage instead of midnight. */
  paper?: boolean;
  children?: React.ReactNode;
}
export declare function Artifact(props: ArtifactProps): JSX.Element;
export interface ArtifactScreenProps { kicker: string; title: string; rows?: [string, string][]; media?: string; action: string; }
export declare function ArtifactScreen(props: ArtifactScreenProps): JSX.Element;
export interface ArtifactDocProps { kicker: string; title: string; lines?: number; sign: string; }
export declare function ArtifactDoc(props: ArtifactDocProps): JSX.Element;
