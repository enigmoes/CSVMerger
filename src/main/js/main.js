$(document).ready(function() {
	// Objeto inicial
	Init.init();
});

// Objeto Init
const Init = {
	parsed1: [],
	parsed2: [],
	csv: null,
	init: function() {
		// Iniciamos eventos
		Init.events();
	},
	events: function() {
		// Parseamos primer CSV
		$("#parse1").on("click", function(e) {
			e.preventDefault();
			let delimiter = $("#delimiter1").val();
			let cuotes = $("#cuotes1").val();
			$("#csv1").parse({
				config: {
					quotes: cuotes,
					delimiter: delimiter,
					complete: function(results) {
						Init.parsed1 = Init.returnArray(results);
						let table = new Handsontable(document.querySelector("#parsed_csv1"), Init.displayTable(Init.parsed1));
						let cols = Init.getColumns(table.getColHeader());
						$('#primary1').html(cols);
						$('#columns').html(cols);
					}
				},
				before: function(file, inputElem) {
					$("#parsed_csv1").html(
						'<div class="text-center"><img src="../main/img/loading.gif" alt="loading..."></div>'
					);
					// console.log("Parsing file...", file);
				},
				error: function(err, file) {
					console.log("ERROR:", err, file);
				},
				complete: function() {
					// console.log("Done with all files");
				}
			});
		});
		// Parseamos segundo CSV
		$("#parse2").on("click", function(e) {
			e.preventDefault();
			let delimiter = $("#delimiter2").val();
			let cuotes = $("#cuotes2").val();
			$("#csv2").parse({
				config: {
					quotes: cuotes,
					delimiter: delimiter,
					complete: function(results) {
						Init.parsed2 = Init.returnArray(results);
						let table = new Handsontable(document.querySelector("#parsed_csv2"), Init.displayTable(Init.parsed2));
						let cols = Init.getColumns(table.getColHeader());
						$('#primary2').html(cols);
					}
				},
				before: function(file, inputElem) {
					$("#parsed_csv2").html(
						'<div class="text-center"><img src="../main/img/loading.gif" alt="loading..."></div>'
					);
					// console.log("Parsing file...", file);
				},
				error: function(err, file) {
					console.log("ERROR:", err, file);
				},
				complete: function() {
					// console.log("Done with all files");
				}
			});
		});
		// Merge option
		$('#merge').on('click', function () {
			Init.mergeCSV();
		});
		// Descargar csv
		$('#download').on('click', function () {
			let data = Init.csv.getData();
			Init.download(data);
		});
	},
	returnArray: function (results) {
		let dataObject = [];
		let data = results.data;
		for (i = 0; i < data.length; i++) {
			let obj = {};
			for (j = 0; j < data[i].length; j++) {
				if (data[i][j] != "") {
					obj[''+ j +''] = data[i][j];
				}
			}
			dataObject.push(obj);
		}
		return dataObject;
	},
	displayTable: function(data) {
		let object = {
			licenseKey: "non-commercial-and-evaluation",
			data: data,
			stretchH: "all",
			width: "100%",
			autoWrapRow: true,
			height: 400,
			manualRowResize: true,
			manualColumnResize: true,
			rowHeaders: false,
			colHeaders: true,
			manualRowMove: true,
			manualColumnMove: true,
			contextMenu: true,
			editor: false
		};
		return object;
	},
	getColumns: function(columns) {
		let options = '';
		// Recorremos
		for(col in columns) {
			options += '<option value="'+ col +'">'+ columns[col] +'</option>';
		}
		return options;
	},
	mergeCSV: function () {
		let primary1 = $('#primary1').val();
		let primary2 = $('#primary2').val();
		let columns = $('#columns').val();
		if (Init.parsed1.length > 0 && Init.parsed2.length > 0) {
			for (item2 in Init.parsed2) {
				let key2 = Init.parsed2[item2][primary2];
				for (item1 in Init.parsed1) {
					let key1 = Init.parsed1[item1][primary1];
					if (key2 === key1) {
						for (col in columns) {
							let keys = Object.keys(Init.parsed2[item2]);
							Init.parsed2[item2][keys.length] = Init.parsed1[item1][columns[col]];
						}
					}
				}
			}
		}
		// Print on table
		Init.csv = new Handsontable(document.querySelector("#csv"), Init.displayTable(Init.parsed2));
	},
	download: function (data) {
		// Crear CSV array
		let csvRows = [];
		for (let i = 0; i < data.length; ++i) {
			for (let j = 0; j < data[i].length; ++j) {
				data[i][j] = '\"' + data[i][j] + '\"';
			}
			csvRows.push(data[i].join(','));
		}
		// Crear csv string
		let csvString = csvRows.join('\r\n');
		// Crear enlace con csv
		let a = document.createElement('a');
		a.href = 'data:attachment/csv,' + csvString;
		a.target = '_blank';
		a.download = 'newCSV.csv';
		// Añadir y evento click en enlace
		document.body.appendChild(a);
		a.click();
	}
};
