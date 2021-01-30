import io from "socket.io-client";
import "./data/types";

// TODO event listener cleanup needed in production

// const ACTIVE_CLASS = "active";
// const NOT_ACTIVE_CLASS = "not-active";

export class GameClient {
  socket: SocketIOClient.Socket | null = null;
  playerId: string = "";
  position: Position = { x: 0, y: 0, z: 0 };
  role: Role | undefined = undefined; // default crew
  dead: boolean = false;
  color: Color | undefined = undefined;
  impostors: Array<string> = []; // playerIds todo
  actions: CrewActions | ImpostorActions | null = null; // todo
  tasks: Array<CrewTask> = []; // todo
  gameStarted: boolean = false;
  setGameState: React.Dispatch<React.SetStateAction<GameState | undefined>>;
  screenQueue: Array<Screens> = [];
  screenPriorityQueue: Array<Screens> = [];
  meetingInfo: MeetingInfo = { callerId: "", players: [], cooldown: null, voterList: [] };
  isMeeting: boolean = false;
  sabotageInfo: SabotageInfo | null = null;

  constructor(setGameState: React.Dispatch<React.SetStateAction<GameState | undefined>>) {
    this.setGameState = setGameState;
    this.socket = io("http://localhost:3000");
    this.socket.on("data", this.processServerMessages.bind(this));
    // document.getElementById("start-game").addEventListener("click", this.startGame.bind(this), false);
  }

  private refreshGameState(): void {
    this.setGameState(this.getGameState());
  }

  public getGameState(): GameState {
    return {
      playerId: this.playerId,
      position: this.position,
      role: this.role,
      dead: this.dead,
      color: this.color,
      impostors: this.impostors,
      actions: this.actions,
      tasks: this.tasks,
      gameStarted: this.gameStarted,
      screenQueue: this.screenQueue,
      screenPriorityQueue: this.screenPriorityQueue,
      meetingInfo: this.meetingInfo,
      isMeeting: this.isMeeting,
      sabotageInfo: this.sabotageInfo,
    };
  }

  public startGame() {
    this.sendMessage({ kind: "start-game" });
  }

  public clearScreenQueue() {
    this.screenQueue = [];
  }
  public shiftScreenQueue() {
    return this.screenQueue.shift();
  }
  public shiftPriorityScreenQueue() {
    return this.screenPriorityQueue.shift();
  }

  public move(axis: "x" | "y" | "z", magnitude: number) {
    this.sendMessage({ kind: "move", position: { [axis]: +magnitude } });
  }

  public kill() {
    console.log("Clicked kill");
    this.sendMessage({ kind: "kill" });
  }

  public sabotage(sabotageKind: SabotageKind) {
    console.log("TODO IMPLEMENT Clicked Sabotage");
    this.sendMessage({ kind: "sabotage", sabotageKind });
  }

  private sendMessage(message: ClientMessage) {
    if (this.socket !== null) {
      this.socket.emit("data", JSON.stringify(message));
    } else {
      console.error("GameClient socket is null!");
    }
  }

  public report() {
    console.log("report");
    // Could pass in the playerID or model
    this.sendMessage({ kind: "report" });
  }

  public startTask() {
    console.log("Clicked task");
    this.sendMessage({ kind: "task-start" });
  }

  public addListenerStartVoteClick(targetPlayerId: string) {
    console.log("add listener start vote click");
    console.log(targetPlayerId);
    // document
    // .getElementById("start-vote-" + targetPlayerId)
    // .addEventListener("click", this.vote.bind(this, targetPlayerId), false);
  }

  public vote(targetPlayerId: string | null) {
    console.log("I VOTED: ");
    console.log(targetPlayerId);
    this.sendMessage({
      kind: "vote",
      targetPlayerId: targetPlayerId,
    });
    const voteWrappers = Array.from(document.getElementsByClassName("vote-buttons"));
    for (let item of voteWrappers) {
      item.innerHTML = "";
    }
  }

  public resetGame() {
    this.sendMessage({ kind: "reset-game" });
  }

  private processServerMessages(serverMessage: string) {
    let message: ServerMessage | null = null;
    try {
      message = JSON.parse(serverMessage);
    } catch (e) {
      console.error(e);
    }

    if (message === null) return;

    switch (message.kind) {
      case "update":
        // TODO remove after dev
        // this.renderPlayerInfo(message.players);
        break;
      case "role-reveal":
        // essentially start game message
        console.log("role-reveal");
        this.playerId = message.playerId;
        this.role = message.role;
        this.tasks = message.tasks;
        this.actions = message.actions;
        this.gameStarted = true;
        this.position = message.position;
        this.screenQueue.push({ type: "shhh", timeout: 1000 });
        this.screenQueue.push({ type: "role-reveal", role: message.role, timeout: 1000 });
        break;
      case "task-complete":
        const completedTaskId = message.taskId;
        const task: CrewTask | undefined = this.tasks.find((curTask) => {
          return curTask.taskId === completedTaskId;
        });
        if (task) task.completed = true;
        // this.renderMyTasks(this.tasks);
        break;
      case "sabotage-task-complete":
        console.log("SABOTAGE TASK COMPLETE");
        if (!this.sabotageInfo)
          console.error("Error processingServerMessages sabotage-task-complete this.sabotageInfo is falsy");

        const sabotageTask = this.sabotageInfo?.emergencyTasks.find((task) => task.taskId === message?.taskId);
        if (!sabotageTask) {
          console.error("sabotageTask was falsy");
          break;
        }

        sabotageTask.completed = true;

        break;
      case "sabotage-task-cancel":
        console.log("SABOTAGE TASK CANCEL");
        break;
      case "kill-available":
        if (this.actions) (this.actions as ImpostorActions).canKill = true;
        break;
      case "kill-unavailable":
        if (this.actions) (this.actions as ImpostorActions).canKill = false;
        break;
      case "task-available":
        if (this.actions) this.actions.canStartTask = true;
        break;
      case "task-unavailable":
        if (this.actions) this.actions.canStartTask = false;
        break;
      case "report-available":
        if (this.actions) this.actions.canReport = true;
        break;
      case "report-unavailable":
        if (this.actions) this.actions.canReport = false;
        break;
      case "died":
        // TODO, change the model
        console.log("died");
        this.dead = true;
        this.screenPriorityQueue.push({ type: "killed", timeout: 3000 });
        break;
      case "meeting-called":
        this.meetingInfo = {
          callerId: message.callerId,
          players: message.players,
          cooldown: this.meetingInfo.cooldown,
          voterList: [],
        };
        this.isMeeting = true;
        // this.screenPriorityQueue.push({ type: "killed", timeout: 3000 });
        // this.renderMeeting(message.players);
        break;
      case "cooldown-info":
        if (message.meetingCooldown) this.meetingInfo.cooldown = message.meetingCooldown;
        if (message.killCooldown) (this.actions as ImpostorActions).killCooldown = message.killCooldown;
        if (message.hasOwnProperty("sabotageCooldown") && message.sabotageCooldown !== undefined)
          (this.actions as ImpostorActions).sabotageCooldown = message.sabotageCooldown;
        console.log(message);
        console.log((this.actions as ImpostorActions).sabotageCooldown);
        break;
      case "win":
        console.log("WIN !!");
        this.screenPriorityQueue.push({
          type: "win",
          role: message.role,
          resetGame: this.resetGame.bind(this),
          timeout: null,
        });
        // this.renderWin(message.role);
        // Reset other game elements
        // this.resetRenderActionButtons();
        // this.resetRenderMyRole();
        // this.resetRenderMyTasks();
        // this.resetRenderMoveButtons();
        break;
      case "reset-game":
        this.gameStarted = false;
        this.role = "crew";
        this.tasks = [];
        this.actions = null;
        this.position = { x: 0, y: 0, z: 0 };
        break;
      case "meeting-result":
        // kind: 'meeting-result',
        // airlockedId: ejectedId,
        // player: this.getPlayerInfoForMeeting(ejectedId),
        //   let text = player === null ? `<h3>No one was ejected</h3>` : `<h3>${player.name} was ejected</h3>`;
        this.isMeeting = false;
        if (this.playerId === message.airlockedId) this.dead = true;
        this.screenPriorityQueue.push({
          type: "airlocked",
          playerName: message.player?.name,
          playerColor: "red", // TODO
          skipped: message.player === null,
          timeout: 3000,
        });
        // this.clearRenderMeeting();
        // this.renderVerdict(message.player);
        break;
      case "vote":
        this.meetingInfo.voterList.push(message.voterId);
        break;
      case "move":
        this.position = message.position;
        break;
      case "sabotage":
        console.log("Received sabotage message!");
        this.sabotageInfo = {
          sabotageKind: message.sabotageKind,
          expires: message.expires,
          progress: message.progress,
          emergencyTasks: message.emergencyTasks,
        };
        break;
      case "sabotage-resolve":
        console.log("Received resolve sabotage message!");
        this.sabotageInfo = null;
        break;
      default:
        break;
    }
    if (message.kind !== "update") this.refreshGameState();
  }

  // private clearRenderMeeting() {
  //   document.getElementById("meeting").innerHTML = "";
  // }

  // private renderMyTasks(tasks: Array<CrewTask>) {
  //   let text = "";
  //   tasks.forEach((task) => {
  //     text += `<p>${task.completed ? "COMPLETED" : ""} ${task.name} : { x:${task.position.x} y:${task.position.y} z:${
  //       task.position.z
  //     } }</p>`;
  //   });
  //   document.getElementById("tasks").innerHTML = text;
  // }

  // private resetRenderMyTasks() {
  //   document.getElementById("tasks").innerHTML = "";
  // }

  // private renderMeeting(players: Array<MeetingPlayers>) {
  //   let text = "";
  //   let alive = players.filter((player) => !player.dead);
  //   for (let i = 0; i < players.length; i++) {
  //     const player = players[i];
  //     text += `<div style="display: flex; flex-direction: row; align-items: center;">
  //      <h2>${player.dead ? "XXX" : ""}${player.name}</h2>
  //      ${
  //        !this.dead && !player.dead
  //          ? `<div class="vote-buttons"">
  //      <button id="start-vote-${player.playerId}">Vote</button>`
  //          : ""
  //      }
  //      </div>
  //     </div>`;
  //   }
  //   text += !this.dead
  //     ? `<div class="vote-buttons">
  //      <button id="start-vote-skip">Skip vote</button>
  //   </div>`
  //     : "";

  //   document.getElementById("meeting").innerHTML = text;

  //   if (!this.dead) {
  //     for (let i = 0; i < alive.length; i++) {
  //       this.addListenerStartVoteClick(alive[i].playerId);
  //     }
  //     this.addListenerStartVoteClick("skip");
  //   }
  // }
  // private renderVerdict(player: MeetingPlayer | null) {
  //   let text = player === null ? `<h3>No one was ejected</h3>` : `<h3>${player.name} was ejected</h3>`;
  //   document.getElementById("meeting").innerHTML = text;
  // }

  // private renderWin(role: Role) {
  //   document.getElementById(
  //     "win"
  //   ).innerHTML = `<h1>Winner! ${role}</h1><div><button id="reset-game">Back to Lobby</button></div>`;
  //   document.getElementById("win").addEventListener("click", this.resetGame.bind(this), false);
  // }

  // private resetRenderWin() {
  //   document.getElementById("win").innerHTML = "";
  // }
  // private toggleActiveStatus(elem: HTMLElement, setActiveStatus: boolean): void {
  //   if (setActiveStatus) this.setActive(elem);
  //   else this.setInactive(elem);
  // }

  // private setActive(elem: HTMLElement): void {
  //   if (!elem) return;
  //   elem.classList.remove(NOT_ACTIVE_CLASS);
  //   elem.classList.add(ACTIVE_CLASS);
  // }

  // private setInactive(elem: HTMLElement): void {
  //   if (!elem) return;
  //   elem.classList.remove(ACTIVE_CLASS);
  //   elem.classList.add(NOT_ACTIVE_CLASS);
  // }

  // public renderMoveButtons(): void {
  //   document.getElementById("move-1").innerHTML = `
  //       <div>
  //       <button class="move" value="x_-1">-</button><span>X</span><button class="move" value="x_1">+</button>
  //       </div>
  //       <div>
  //       <button class="move" value="y_-1">-</button><span>Y</span><button class="move" value="y_1">+</button>
  //       </div>
  //       <div>
  //       <button class="move" value="z_-1">-</button><span>Z</span><button class="move" value="z_1">+</button>
  //       </div>
  //    `;
  //   document.addEventListener(
  //     "click",
  //     (event: Event) => {
  //       const target: HTMLInputElement = <HTMLInputElement>event.target;
  //       if (target.matches(".move")) {
  //         let [axis, magnitude] = target.value.split("_");
  //         if (axis === "x" || axis === "y" || axis === "z") {
  //           this.move(axis, +magnitude);
  //         } else {
  //           // unexpected error
  //           console.error("something went wrong in move click()");
  //         }
  //       }
  //     },
  //     false
  //   );
  // }

  // private resetRenderMoveButtons() {
  //   document.getElementById("move-1").innerHTML = "";
  // }

  // private renderPlayerInfo(players: { [playerId: string]: Player }): void {
  //   console.log("inside render player info");
  //   // updateplayerinfo
  //   let text = "";
  //   for (const playerId in players) {
  //     const { position, role } = players[playerId];
  //     text += `
  //    <div><span>playerId: ${playerId}</span>
  //    <span>position: ${JSON.stringify(position)}</span>
  //    <span>role: ${role}</span>
  //    </div>`;
  //   }
  //   document.getElementById("main").innerHTML = text;
  // }

  // private renderMyRole(role: Role) {
  //   document.getElementById("me").innerHTML = `<h2>${role}</h2>`;
  // }

  // private resetRenderMyRole() {
  //   document.getElementById("me").innerHTML = "";
  // }

  // private renderActionButtons() {
  //   console.log("this.role");
  //   console.log(this.role);
  //   document.getElementById("actions").innerHTML =
  //     this.role === "crew"
  //       ? `<button class="not-active" id="report">Report</button>
  //     <button class="not-active" id="task">Start Task</button>`
  //       : `<button id="report" class="not-active">Report</button>
  //     <button id="kill" class="not-active">Kill</button>
  //     <button id="sabotage" class="not-active">Sabotage</button>`;

  //   if (this.role === "crew") {
  //     // TODO TASK BUTTON
  //     document.getElementById("task").addEventListener("click", this.startTask.bind(this), false);
  //   }
  //   if (this.role === "impostor") {
  //     document.getElementById("kill").addEventListener("click", this.kill.bind(this), false);
  //   }
  //   document.getElementById("report").addEventListener("click", this.report.bind(this), false);
  // }

  // private resetRenderActionButtons() {
  //   document.getElementById("actions").innerHTML = "";
  // }
}
