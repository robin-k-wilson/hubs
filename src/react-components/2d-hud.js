import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

const { detect } = require("detect-browser");
import styles from "../assets/stylesheets/2d-hud.scss";
import uiStyles from "../assets/stylesheets/ui-root.scss";
import { FormattedMessage } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

const browser = detect();

class TopHUD extends Component {
  static propTypes = {
    muted: PropTypes.bool,
    volumeLevel: PropTypes.number,
    isCursorHoldingPen: PropTypes.bool,
    hasActiveCamera: PropTypes.bool,
    frozen: PropTypes.bool,
    watching: PropTypes.bool,
    onWatchEnded: PropTypes.func,
    videoShareMediaSource: PropTypes.string,
    activeTip: PropTypes.string,
    history: PropTypes.object,
    onToggleMute: PropTypes.func,
    onToggleFreeze: PropTypes.func,
    onSpawnPen: PropTypes.func,
    onSpawnCamera: PropTypes.func,
    onShareVideo: PropTypes.func,
    onEndShareVideo: PropTypes.func,
    onShareVideoNotCapable: PropTypes.func,
    mediaSearchStore: PropTypes.object,
    isStreaming: PropTypes.bool,
    showStreamingTip: PropTypes.bool,
    hideStreamingTip: PropTypes.func
  };

  state = {
    showVideoShareOptions: false,
    lastActiveMediaSource: null
  };

  handleVideoShareClicked = source => {
    if ((source === "screen" || source === "window") && browser.name !== "firefox") {
      this.props.onShareVideoNotCapable();
      return;
    }

    if (this.props.videoShareMediaSource) {
      this.props.onEndShareVideo();
    } else {
      this.props.onShareVideo(source);
      this.setState({ lastActiveMediaSource: source });
    }
  };

  buildVideoSharingButtons = () => {
    const isMobile = AFRAME.utils.device.isMobile() || AFRAME.utils.device.isMobileVR();

    const videoShareExtraOptionTypes = [];
    const primaryVideoShareType =
      this.props.videoShareMediaSource || this.state.lastActiveMediaSource || (isMobile ? "camera" : "screen");

    if (this.state.showVideoShareOptions) {
      videoShareExtraOptionTypes.push(primaryVideoShareType);

      ["screen", "window", "camera"].forEach(t => {
        if (videoShareExtraOptionTypes.indexOf(t) === -1) {
          videoShareExtraOptionTypes.push(t);
        }
      });
    }

    const showExtrasOnHover = () => {
      if (isMobile) return;

      clearTimeout(this.hideVideoSharingButtonTimeout);

      if (!this.props.videoShareMediaSource) {
        this.setState({ showVideoShareOptions: true });
      }
    };

    const hideExtrasOnOut = () => {
      this.hideVideoSharingButtonTimeout = setTimeout(() => {
        this.setState({ showVideoShareOptions: false });
      }, 250);
    };

    return (
      <div
        className={cx(styles.iconButton, styles[`share_${primaryVideoShareType}`], {
          [styles.active]: this.props.videoShareMediaSource === primaryVideoShareType,
          [styles.videoShare]: true
        })}
        title={this.props.videoShareMediaSource !== null ? "Stop sharing" : `Share ${primaryVideoShareType}`}
        onClick={() => {
          if (!this.state.showVideoShareOptions) {
            this.handleVideoShareClicked(primaryVideoShareType);
          }
        }}
        onMouseOver={showExtrasOnHover}
      >
        {videoShareExtraOptionTypes.length > 0 && (
          <div className={cx(styles.videoShareExtraOptions)} onMouseOut={hideExtrasOnOut}>
            {videoShareExtraOptionTypes.map(type => (
              <div
                key={type}
                className={cx(styles.iconButton, styles[`share_${type}`], {
                  [styles.active]: this.props.videoShareMediaSource === type
                })}
                title={this.props.videoShareMediaSource === type ? "Stop sharing" : `Share ${type}`}
                onClick={() => this.handleVideoShareClicked(type)}
                onMouseOver={showExtrasOnHover}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  render() {
    const videoSharingButtons = this.buildVideoSharingButtons();
    const isMobile = AFRAME.utils.device.isMobile();

    let tip;

    if (this.props.watching) {
      tip = (
        <div className={cx([styles.topTip, styles.topTipNoHud])}>
          <button className={styles.tipCancel} onClick={() => this.props.onWatchEnded()}>
            <i>
              <FontAwesomeIcon icon={faTimes} />
            </i>
          </button>
          <FormattedMessage id={`tips.${isMobile ? "mobile" : "desktop"}.watching`} />
          {!isMobile && (
            <button className={styles.tipCancelText} onClick={() => this.props.onWatchEnded()}>
              <FormattedMessage id="tips.watching.back" />
            </button>
          )}
        </div>
      );
    } else if (this.props.activeTip) {
      tip = this.props.activeTip && (
        <div className={cx(styles.topTip)}>
          {!this.props.frozen && (
            <div className={cx([styles.attachPoint, styles[`attach_${this.props.activeTip.split(".")[1]}`]])} />
          )}
          <FormattedMessage id={`tips.${this.props.activeTip}`} />
        </div>
      );
    }

    const micLevelStyle =
      this.props.volumeLevel < 0.2
        ? 0
        : this.props.volumeLevel < 0.3
          ? 1
          : this.props.volumeLevel < 0.6
            ? 2
            : this.props.volumeLevel < 1.3
              ? 3
              : 4;
    // Hide buttons when frozen.
    return (
      <div className={cx(styles.container, styles.top, styles.unselectable, uiStyles.uiInteractive)}>
        {this.props.frozen || this.props.watching ? (
          <div className={cx(uiStyles.uiInteractive, styles.panel)}>{tip}</div>
        ) : (
          <div className={cx(uiStyles.uiInteractive, styles.panel)}>
            {tip}
            {videoSharingButtons}
            <div
              className={cx(
                styles.iconButton,
                styles.mute,
                { [styles.active]: this.props.muted },
                { [styles.volumeLevel1]: micLevelStyle === 1 },
                { [styles.volumeLevel2]: micLevelStyle === 2 },
                { [styles.volumeLevel3]: micLevelStyle === 3 },
                { [styles.volumeLevel4]: micLevelStyle === 4 }
              )}
              title={this.props.muted ? "Unmute Mic" : "Mute Mic"}
              onClick={this.props.onToggleMute}
            >
              <div className={cx(styles.iconButton)} />
            </div>
            <button
              className={cx(uiStyles.uiInteractive, styles.iconButton, styles.spawn)}
              onClick={() => this.props.mediaSearchStore.sourceNavigateToDefaultSource()}
            />
            <div
              className={cx(styles.iconButton, styles.pen, { [styles.active]: this.props.isCursorHoldingPen })}
              title={"Pen"}
              onClick={this.props.onSpawnPen}
            />
            <div
              className={cx(styles.iconButton, styles.camera, { [styles.active]: this.props.hasActiveCamera })}
              title={"Camera"}
              onClick={this.props.onSpawnCamera}
            />
          </div>
        )}
      </div>
    );
  }
}

export default { TopHUD };
