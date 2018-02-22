<template lang="jade">
#cell-info(v-if="cell")
	a(href='#' onclick='document.getElementById("cell-info").style.display="none";return false;' style='color:white') (close)
	p
		a(href='#' id='map-info-on' onclick='document.getElementById("map-info-on").style.display="none";document.getElementById("map-info-off").style.display="";document.getElementById("map-info").style.display=""; return false;' style='color:white') Erklärung einblenden
		a(href='#' id='map-info-off' onclick='document.getElementById("map-info-on").style.display="";document.getElementById("map-info-off").style.display="none";document.getElementById("map-info").style.display="none"; return false;' style='color:white; display:none;') Erklärung ausblenden
	div(id='map-info' style='display:none')
		p Die Kacheln werden aktuell nach dem Durchschnitt der PM10-Werte aller in der Zelle enthaltenen Sensoren eingefärbt. Siehe dazu die Skala unten links.
		p Die Zahlen in der ersten Spalte entsprechen den Sensor-IDs. Die erste Zeile 'mean' enthält die jeweiligen Durchschnittswerte aller in der Zelle enthaltenen Sensoren.
		p Bitte beachten: Wir zeigen auf der Karte die Werte der letzten 5 Minuten an. Die von den jeweiligen Landesbehörden veröffentlichen Werte werden als 24-Stunden-Mittelwert angegeben. Dadurch können die Werte auf der Karte deutlich von diesen 24-Stunden-Mittelwerten abweichen.
		p Durch einen Klick auf das Plus vor der Sensor-ID können 2 Grafiken eingeblendet werden. Die Grafik '24 h floating' zeigt den gleitenden 24-Stunden-Mittelwert für die letzten 7 Tage an. Aus technischen Gründen ist am Anfang eine Lücke von einem Tag, die Darstellung zeigt also eigentlich 8 Tage, der erste ist aber leer. Die zweite Grafik 'Last 24 hours' zeigt den Tagesverlauf für die letzten 24 Stunden.
	h3 #Sensors {{cell.length}}
	
	table
		tr
			th Sensor ID
			th PM10 µg/m³
			th PM2.5 µg/m³
		tr.mean
			td mean
			td {{mean.P1.toFixed(0)}}
			td {{mean.P2.toFixed(0)}}
		template(v-for="sensor in cell")
			tr
				td(style="text-align:left;")
					a(:id="'graph_'+sensor.o.id+'_on'" class="graph_on" onclick="var sensor=this.id.substring(0,this.id.length-3);document.getElementById(sensor).style.display='';document.getElementById(sensor+'_on').style.display='none';document.getElementById(sensor+'_off').style.display=''; document.getElementById('images_'+sensor.substr(6)).innerHTML='<img src=\"https://api.luftdaten.info/grafana/render/dashboard-solo/db/single-sensor-view?orgId=1&panelId=1&width=300&height=200&tz=UTC%2B02%3A00&var-node=' + sensor.substring(6) + '\" /><br /><img src=\"https://api.luftdaten.info/grafana/render/dashboard-solo/db/single-sensor-view?orgId=1&panelId=2&width=300&height=200&tz=UTC%2B02%3A00&var-node=' + sensor.substring(6) + '\" /><br /><br />'; return false;" href='#' style='color:white; text-decoration: none;') (+)&nbsp;{{sensor.o.id}}
					a(:id="'graph_'+sensor.o.id+'_off'" class="graph_off" onclick="var sensor=this.id.substring(0,this.id.length-4);document.getElementById(sensor).style.display='none';document.getElementById(sensor+'_on').style.display='';document.getElementById(sensor+'_off').style.display='none'; document.getElementById('images_'+sensor.substr(6)).innerHTML=''; return false;" href='#' style='color:white; text-decoration: none; display: none;') (-)&nbsp;{{sensor.o.id}}
				td {{sensor.o.data.P1.toFixed(0)}}
				td {{sensor.o.data.P2.toFixed(0)}}
			tr(:id = "'graph_'+sensor.o.id" style="display:none" class="cell_info_images")
				td(:id = "'images_'+sensor.o.id" colspan='3')
					br
</template>
<script>
import _ from 'lodash'

export default {
	data () {
		return {
		}
	},
	props: {
		'cell': Array
	},
	computed: {
		mean () {
			return {
				P1: _.meanBy(this.cell, (o) => o.o.data.P1),
				P2: _.meanBy(this.cell, (o) => o.o.data.P2)
			}
		}
	}
}
</script>
<style lang="stylus">
</style>
