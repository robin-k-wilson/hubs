type GameState = {
  playerId: string;
  position: Position;
  role: Role | undefined;
  dead: boolean;
  color: Color | undefined;
  impostors: string[];
  actions: CrewActions | ImpostorActions | null;
  tasks: Array<CrewTask>;
  gameStarted: boolean;
  screenQueue: Array<Screens>;
  screenPriorityQueue: Array<Screens>;
  isMeeting: boolean;
  meetingInfo: MeetingInfo;
  sabotageInfo: SabotageInfo | null;
};

type MeetingInfo = {
  callerId: string;
  players: Array<MeetingPlayer>;
  cooldown: number | null;
  voterList: Array<string>;
};

type Screens =
  | ((ScreensReport | ScreensAirlock | ScreensKilled | ScreensRoleReveal | ScreensShhh) & {
      timeout: number;
    })
  | ScreensMeeting
  | ScreensWin;
type ScreensReport = {
  type: "report";
};
type ScreensKilled = {
  type: "killed";
};
type ScreensShhh = {
  type: "shhh";
};
type ScreensMeeting = {
  type: "meeting";
  meetingInfo: MeetingInfo;
  impostors: Array<string>;
  myPlayerId: string;
  vote: (targetPlayerId: string | null) => void;
  iDead: boolean;
};
type ScreensAirlock = {
  type: "airlocked";
  playerName: string;
  playerColor: Color;
  skipped: boolean;
};
type ScreensRoleReveal = {
  type: "role-reveal";
  role: Role;
};
type ScreensWin = {
  type: "win";
  role: Role;
  timeout: null;
  resetGame: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  resetScreen: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

type Color =
  | "blue"
  | "brown"
  | "green"
  | "black"
  | "lightblue"
  | "lime"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "white"
  | "yellow";

interface Position2D {
  x: number;
  y: number;
}

interface Position {
  x: number;
  y: number;
  z: number;
}
type SabotageKind = "o2" | "reactor";

/** Client Messages */
interface ClientHandshake {
  // still same player if they refresh
  kind: "handshake";
  secretKey: string; // randomly generate on client, save in localstorage
}
interface ClientMove {
  kind: "move";
  position: Partial<Position>;
}
interface ServerMove {
  kind: "move";
  position: Position;
}
interface ClientKill {
  kind: "kill";
  // targetPlayerId: string
  // TODO kill ?? this way
}
interface ClientReport {
  kind: "report";
}
interface ClientTaskStart {
  kind: "task-start";
}
interface ClientTaskCancel {
  kind: "task-cancel";
}
interface ClientCallMeeting {
  kind: "call-meeting";
}
interface ClientStartGame {
  kind: "start-game";
}
interface ClientResetGame {
  kind: "reset-game";
}
interface ClientSabotage {
  kind: "sabotage";
  sabotageKind: SabotageKind;
}
interface ClientVote {
  kind: "vote";
  targetPlayerId: string | null; // null means skip
}

type ClientMessage =
  | ClientHandshake
  | ClientMove
  | ClientKill
  | ClientReport
  | ClientTaskStart
  | ClientTaskCancel
  | ClientCallMeeting
  | ClientStartGame
  | ClientSabotage
  | ClientVote
  | ClientResetGame;

type ClientEvent = ClientMessage & {
  playerId: string;
};

/** Server Messages */
type Role = "impostor" | "crew";

type Player = (PlayerBase & PlayerImpostor) | (PlayerBase & PlayerCrew);

interface PlayerBase {
  name: string;
  position: Position;
  dead: boolean;
  tasks: Array<CrewTask>;
  color: Color;
}

interface PlayerImpostor {
  role: "impostor";
  actions: ImpostorActions;
}

interface PlayerCrew {
  role: "crew";
  actions: CrewActions;
}

interface ImpostorActions {
  canReport: boolean;
  canKill: boolean;
  killCooldown: number; // timestamp
  canSabotage: boolean;
  sabotageCooldown: number | null; // timestamp
  canStartTask: boolean;
}

interface CrewActions {
  canReport: boolean;
  canStartTask: boolean;
}

interface CrewTask extends Task {
  completed: boolean;
}
interface Task {
  taskId: string;
  name: string;
  position: Position;
}

interface TaskList {
  [taskId: string]: Task;
}

// TODO REMOVE
interface ServerUpdate {
  kind: "update";
  players: { [playerId: string]: Player };
}

interface ServerRoleReveal {
  kind: "role-reveal";
  playerId: string;
  role: Role;
  tasks: Array<CrewTask>;
  actions: CrewActions | ImpostorActions;
  position: Position;
}
interface ServerTaskComplete {
  kind: "task-complete";
  taskId: string;
}
interface ServerTaskAvailable {
  kind: "task-available";
}
interface ServerTaskUnavailable {
  kind: "task-unavailable";
}
interface ServerReportAvailable {
  kind: "report-available";
}
interface ServerReportUnavailable {
  kind: "report-unavailable";
}
interface ServerKillAvailable {
  kind: "kill-available";
}
interface ServerKillUnavailable {
  kind: "kill-unavailable";
}
interface ServerMeetingCalled {
  kind: "meeting-called";
  callerId: string;
  players: Array<MeetingPlayer>;
}
interface MeetingPlayer {
  name: string;
  playerId: string;
  dead: boolean;
}
interface ServerVote {
  kind: "vote";
  voterId: string;
  votedId: string | null;
}
interface ServerMeetingResult {
  kind: "meeting-result";
  airlockedId: string | null;
  player: MeetingPlayer;
}
interface ServerCooldownInfo {
  kind: "cooldown-info";
  meetingCooldown?: number;
  sabotageCooldown?: number | null;
  killCooldown?: number;
}

// interface ServerSabotage {
//   kind: "sabotage";
//   sabotageKind: SabotageKind;
//   expires: number; // seconds until sabotage ends game
//   progress: 0 | 1 | 2;
// }
type ServerSabotage = {
  kind: "sabotage";
} & SabotageInfo;
interface SabotageInfo {
  sabotageKind: SabotageKind;
  expires: number; // seconds until sabotage ends game
  progress: 0 | 1 | 2;
  emergencyTasks: Array<CrewTask>;
}
interface SabotageResolved {
  kind: "sabotage-resolve";
}

interface ServerReport {
  kind: "report";
  reporterId: string;
  reportedId: string;
}
interface ServerPlayerDied {
  kind: "died";
  deadPlayerId: string;
}
interface ServerWin {
  kind: "win";
  role: Role;
}
interface ServerResetGame {
  kind: "reset-game";
}

type ServerMessage =
  | SabotageResolved
  | ServerUpdate
  | ServerTaskAvailable
  | ServerTaskUnavailable
  | ServerTaskComplete
  | ServerReportAvailable
  | ServerReportUnavailable
  | ServerKillAvailable
  | ServerKillUnavailable
  | ServerMeetingCalled
  | ServerVote
  | ServerMeetingResult
  | ServerCooldownInfo
  | ServerSabotage
  | ServerReport
  | ServerPlayerDied
  | ServerRoleReveal
  | ServerWin
  | ServerResetGame
  | ServerMove;
