const { app, BrowserWindow, Menu } = require("electron");
const url = require("url");
const path = require("path");

if (!app.isPackaged) {
	require("electron-reload")(__dirname, {
		electron: path.join(__dirname, "../node_modules", ".bin", "electron")
	});
}

let mainWindow;

// Funcion que inicia la aplicacion
app.on("ready", () => {
    // The Main Window
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 700,
	});
	// Load icon
	mainWindow.setIcon(path.join(__dirname, 'main/img/icon.png'));
	
	// Load first view
	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, "main/index.html"),
			protocol: "file",
			slashes: true
		})
	);

	// Menu
	const mainMenu = Menu.buildFromTemplate(templateMenu);
	// Set The Menu to the Main Window
	Menu.setApplicationMenu(mainMenu);

	// If we close main Window the App quit
	mainWindow.on("closed", () => {
		app.quit();
	});
});

// Menu Template
const templateMenu = [
	{
		label: "File",
		submenu: [
			{
				label: "Exit",
				accelerator: process.platform == "darwin" ? "command+Q" : "Ctrl+Q",
				click() {
					app.quit();
				}
			}
		]
	},
	{
		label: 'View',
		submenu: [
			{
				label: 'Reload',
				accelerator: process.platform == "darwin" ? "command+R" : "Ctrl+R",
				click() {
					mainWindow.reload()
				}
			}
		]
	}
];

// if you are in Mac, just add the Name of the App
if (process.platform === "darwin") {
	templateMenu.unshift({
		label: app.getName()
	});
}

// Developer Tools in Development Environment
if (!app.isPackaged) {
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
