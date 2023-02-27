const { app, BrowserWindow, Menu, nativeTheme } = require("electron");
const url = require("url");
const path = require("path");

// Ventana principal
let mainWindow;

// Main Menu Template
const templateMenu = [];

if (!app.isPackaged) {
	require("electron-reload")(__dirname, {
		electron: path.join(__dirname, "node_modules", ".bin", "electron")
	});
	// Developer Tools in Development Environment
	templateMenu.push({
		label: "DevTools",
		submenu: [
			{
				label: "Show/Hide Dev Tools",
				accelerator:
					process.platform == "darwin" ? "Comand+D" : "Ctrl+D",
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: "reload"
			}
		]
	});
}

function createWindow() {
	// The Main Window
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 700,
	});
	// Load icon
	mainWindow.setIcon(path.join(__dirname, 'assets/img/icon.png'));
	
	// Load first view
	mainWindow.loadURL(path.join(__dirname, "src/View/Main/index.html"));

	// Menu
	const mainMenu = Menu.buildFromTemplate(templateMenu);
	// Set The Menu to the Main Window
	Menu.setApplicationMenu(mainMenu);

	// Set native theme light
	nativeTheme.themeSource = 'light';
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();

	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
	if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// if you are in Mac, just add the Name of the App
if (process.platform === "darwin") {
	templateMenu.unshift({
		label: app.getName()
	});
}