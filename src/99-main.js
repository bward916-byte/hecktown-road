bakeShared();
player.hero = hero;
loadWorld('easton');
buildTitle();
requestAnimationFrame(frame);
// warm one render so the background shows under the title
render();
