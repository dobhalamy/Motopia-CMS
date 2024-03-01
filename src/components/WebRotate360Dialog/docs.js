// Interior Hotspot Configuration

const interiorHotspotConfig = {
  pitch,
  // Specifies the pitch portion of the hot spot’s location, in degrees.
  yaw,
  // Specifies the yaw portion of the hot spot’s location, in degrees.
  type: 'custom',
  // Specifies the type of the hot spot. Can be scene for scene links or info for information hot spots. A tour configuration file is required for scene hot spots.
  text: 'Test',
  // This specifies the text that is displayed when the user hovers over the hot spot.
  URL: '',
  // If specified for an info hot spot, the hot spot links to the specified URL. Not applicable for scene hot spots.
  sceneId: VIEWS.interior,
  // Specifies the ID of the scene to link to for scene hot spots. Not applicable for info hot spots.
  targetPitch: 0,
  // Specifies the pitch of the target scene, in degrees. Can also be set to same, which uses the current pitch of the current scene as the initial pitch of the target scene.
  targetYaw: 0,
  // Specifies the yaw of the target scene, in degrees. Can also be set to same or sameAzimuth. These settings use the current yaw of the current scene as the initial yaw of the target scene; same uses the current yaw directly, while sameAzimuth takes into account the northOffset values of both scenes to maintain the same direction with regard to north.
  targetHfov: 0,
  // Specifies the HFOV of the target scene, in degrees. Can also be set to same, which uses the current HFOV of the current scene as the initial HFOV of the target scene.
  id: '',
  // Specifies hot spot ID, for use with API’s removeHotSpot function.
  cssClass: '',
  // If specified, string is used as the CSS class for the hot spot instead of the default CSS classes.
  createTooltipFunc: (hotSpotDiv, tooltipArgs) => {},
  createTooltipArgs: {},
  // If createTooltipFunc is specified, this function is used to create the hot spot tooltip DOM instead of the default function. The contents of createTooltipArgs are passed to the function as arguments.

  clickHandlerFunc: (e, clickHandlerArgs) => {
    console.log(e);
    console.log(clickHandlerArgs);
  },
  // If clickHandlerFunc is specified, this function is added as an event handler for the hot spot’s click event. The event object and the contents of clickHandlerArgs are passed to the function as arguments.
  scale: true,
  // When true, the hot spot is scaled to match changes in the field of view, relative to the initial field of view. Note that this does not account for changes in local image scale that occur due to distortions within the viewport. Defaults to false.
};

// Config fo exteriorPlayToLabelConfig
// Additional options you can set to config:
const exteriorPlayToLabelConfig = {
  speed: 2, // number of seconds it takes to make a full spin,
  direction: 0, // short path = 0, long path = 1, clockwise = 2, counterclockwise = 3,
  keyHotspot: 'spot1', // optional hotspot name to activate and/or trigger or zoom to,
  activateHotspot: true / false, // activate keyHotspot,
  hotspotTriggerDelay: 2000, // number of milliseconds after which to trigger keyHotspot action (if action is present and even if not activated),
  resetZoom: true / false, // zoom out if zoomed before starting the playback,
  zoomOutSpeed: 400, // resetZoom speed in milliseconds,
  zoomToHotspot: true / false, // zoom to keyHotspot,
  zoomInSpeed: 400, // zoom to hotspot speed in milliseconds,
  disableDrag: true / false, // disable image dragging via mouse or touch while playToLabel is running
};
