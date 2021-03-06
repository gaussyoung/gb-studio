/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../actions";
import MovementTypeSelect from "../forms/MovementTypeSelect";
import SpriteSheetSelect from "../forms/SpriteSheetSelect";
import ScriptEditor from "../script/ScriptEditor";
import DirectionPicker from "../forms/DirectionPicker";
import { FormField, ToggleableFormField } from "../library/Forms";
import castEventValue from "../../lib/helpers/castEventValue";
import { DropdownButton } from "../library/Button";
import { MenuItem, MenuDivider } from "../library/Menu";
import l10n from "../../lib/helpers/l10n";
import MovementSpeedSelect from "../forms/MovementSpeedSelect";
import AnimationSpeedSelect from "../forms/AnimationSpeedSelect";
import Sidebar, { SidebarHeading, SidebarColumn } from "./Sidebar";
import { SceneIcon } from "../library/Icons";
import { ActorShape, SceneShape, SpriteShape } from "../../reducers/stateShape";

class ActorEditor extends Component {
  onEdit = key => e => {
    const { editActor, sceneId, actor } = this.props;
    editActor(sceneId, actor.id, {
      [key]: castEventValue(e)
    });
  };

  onCopy = e => {
    const { copyActor, actor } = this.props;
    copyActor(actor);
  };

  onPaste = e => {
    const { clipboardActor, sceneId, pasteActor } = this.props;
    pasteActor(sceneId, clipboardActor);
  };

  onRemove = e => {
    const { removeActor, sceneId, actor } = this.props;
    removeActor(sceneId, actor.id);
  };

  render() {
    const { index, actor, scene, spriteSheet, clipboardActor } = this.props;

    if (!actor) {
      return <div />;
    }

    const showDirectionInput =
      spriteSheet &&
      spriteSheet.type !== "static" &&
      spriteSheet.type !== "animated" &&
      actor.movementType !== "static";

    const showFrameInput =
      spriteSheet &&
      spriteSheet.numFrames > 1 &&
      actor.movementType === "static";

    const showAnimatedCheckbox =
      spriteSheet &&
      spriteSheet.numFrames > 1 &&
      (actor.movementType === "static" || spriteSheet.type !== "actor");

    const showAnimSpeed =
      spriteSheet &&
      ((spriteSheet.type === "actor_animated" &&
        actor.movementType !== "static") ||
        (actor.animate &&
          (actor.movementType === "static" || spriteSheet.type !== "actor")));

    return (
      <Sidebar>
        <SidebarColumn>
          <SidebarHeading
            title={l10n("ACTOR")}
            buttons={
              <DropdownButton small transparent right>
                <MenuItem onClick={this.onCopy}>
                  {l10n("MENU_COPY_ACTOR")}
                </MenuItem>
                {clipboardActor && (
                  <MenuItem onClick={this.onPaste}>
                    {l10n("MENU_PASTE_ACTOR")}
                  </MenuItem>
                )}
                <MenuDivider />
                <MenuItem onClick={this.onRemove}>
                  {l10n("MENU_DELETE_ACTOR")}
                </MenuItem>
              </DropdownButton>
            }
          />

          <div>
            <FormField>
              <label htmlFor="actorName">
                {l10n("FIELD_NAME")}
                <input
                  id="actorName"
                  placeholder={`Actor ${index + 1}`}
                  value={actor.name || ""}
                  onChange={this.onEdit("name")}
                />
              </label>
            </FormField>

            <FormField halfWidth>
              <label htmlFor="actorX">
                {l10n("FIELD_X")}
                <input
                  id="actorX"
                  type="number"
                  value={actor.x || ""}
                  placeholder={0}
                  min={0}
                  max={scene.width - 2}
                  onChange={this.onEdit("x")}
                />
              </label>
            </FormField>

            <FormField halfWidth>
              <label htmlFor="actorY">
                {l10n("FIELD_Y")}
                <input
                  id="actorY"
                  type="number"
                  value={actor.y || ""}
                  placeholder={0}
                  min={0}
                  max={scene.height - 1}
                  onChange={this.onEdit("y")}
                />
              </label>
            </FormField>

            <FormField>
              <label htmlFor="actorSprite">
                {l10n("FIELD_SPRITE_SHEET")}
                <SpriteSheetSelect
                  id="actorSprite"
                  value={actor.spriteSheetId}
                  direction={actor.direction}
                  frame={
                    spriteSheet &&
                    spriteSheet.numFrames > 1 &&
                    actor.movementType === "static"
                      ? actor.frame
                      : 0
                  }
                  onChange={this.onEdit("spriteSheetId")}
                />
              </label>
            </FormField>

            {spriteSheet &&
              spriteSheet.type !== "static" &&
              spriteSheet.type !== "animated" && (
                <FormField halfWidth>
                  <label htmlFor="actorMovement">
                    {l10n("FIELD_MOVEMENT_TYPE")}
                    <MovementTypeSelect
                      id="actorMovement"
                      value={actor.movementType}
                      onChange={this.onEdit("movementType")}
                    />
                  </label>
                </FormField>
              )}

            {showDirectionInput && (
              <FormField halfWidth>
                <label htmlFor="actorDirection">
                  {l10n("FIELD_DIRECTION")}
                  <DirectionPicker
                    id="actorDirection"
                    value={actor.direction}
                    onChange={this.onEdit("direction")}
                  />
                </label>
              </FormField>
            )}

            {showFrameInput && (
              <FormField halfWidth>
                <label htmlFor="actorFrame">
                  {l10n("FIELD_INITIAL_FRAME")}
                  <input
                    id="actorFrame"
                    type="number"
                    min={0}
                    max={spriteSheet.numFrames - 1}
                    placeholder={0}
                    value={actor.frame || ""}
                    onChange={this.onEdit("frame")}
                  />
                </label>
              </FormField>
            )}

            {showAnimatedCheckbox && (
              <FormField>
                <label htmlFor="actorAnimate">
                  <input
                    id="actorAnimate"
                    type="checkbox"
                    className="Checkbox"
                    checked={actor.animate || false}
                    onChange={this.onEdit("animate")}
                  />
                  <div className="FormCheckbox" />
                  {actor.movementType !== "static" &&
                  spriteSheet.type === "actor_animated"
                    ? l10n("FIELD_ANIMATE_WHEN_STATIONARY")
                    : l10n("FIELD_ANIMATE_FRAMES")}
                </label>
              </FormField>
            )}

            <FormField halfWidth>
              <label htmlFor="actorMoveSpeed">
                {l10n("FIELD_MOVEMENT_SPEED")}

                <MovementSpeedSelect
                  id="actorMoveSpeed"
                  value={actor.moveSpeed}
                  onChange={this.onEdit("moveSpeed")}
                />
              </label>
            </FormField>

            {showAnimSpeed && (
              <FormField halfWidth>
                <label htmlFor="actorAnimSpeed">
                  {l10n("FIELD_ANIMATION_SPEED")}

                  <AnimationSpeedSelect
                    id="actorAnimSpeed"
                    value={actor.animSpeed}
                    onChange={this.onEdit("animSpeed")}
                  />
                </label>
              </FormField>
            )}

            <ToggleableFormField
              htmlFor="actorNotes"
              closedLabel={l10n("FIELD_ADD_NOTES")}
              label={l10n("FIELD_NOTES")}
              open={!!actor.notes}
            >
              <textarea
                id="actorNotes"
                value={actor.notes || ""}
                placeholder={l10n("FIELD_NOTES")}
                onChange={this.onEdit("notes")}
                rows={3}
              />
            </ToggleableFormField>
          </div>

          <SidebarHeading title={l10n("SIDEBAR_NAVIGATION")} />
          <ul>
            <li
              onClick={() => {
                const { selectScene } = this.props;
                selectScene(scene.id);
              }}
            >
              <div className="EditorSidebar__Icon">
                <SceneIcon />
              </div>
              {scene.name || `Scene ${index + 1}`}
            </li>
          </ul>
        </SidebarColumn>

        <SidebarColumn>
          <ScriptEditor
            value={actor.script}
            type="actor"
            title={l10n("SIDEBAR_ACTOR_SCRIPT")}
            onChange={this.onEdit("script")}
          />
        </SidebarColumn>
      </Sidebar>
    );
  }
}

ActorEditor.propTypes = {
  index: PropTypes.number.isRequired,
  actor: ActorShape,
  scene: SceneShape,
  sceneId: PropTypes.string.isRequired,
  clipboardActor: ActorShape,
  spriteSheet: SpriteShape,
  editActor: PropTypes.func.isRequired,
  removeActor: PropTypes.func.isRequired,
  copyActor: PropTypes.func.isRequired,
  pasteActor: PropTypes.func.isRequired,
  selectScene: PropTypes.func.isRequired
};

ActorEditor.defaultProps = {
  actor: null,
  scene: null,
  spriteSheet: null,
  clipboardActor: null
};

function mapStateToProps(state, props) {
  const { project } = state;
  const scene =
    project.present.scenes &&
    project.present.scenes.find(s => s.id === props.sceneId);
  const actor = scene && scene.actors.find(a => a.id === props.id);
  const index = scene && scene.actors.indexOf(actor);
  const spriteSheet =
    actor &&
    project.present.spriteSheets.find(s => s.id === actor.spriteSheetId);
  return {
    index,
    actor,
    scene,
    spriteSheet,
    clipboardActor: state.clipboard.actor
  };
}

const mapDispatchToProps = {
  editActor: actions.editActor,
  removeActor: actions.removeActor,
  copyActor: actions.copyActor,
  pasteActor: actions.pasteActor,
  selectScene: actions.selectScene
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActorEditor);
