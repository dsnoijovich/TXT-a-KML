function convertir() {
  const txtFile = document.getElementById('txtFile').files[0];
  const reader = new FileReader();

function rgbHexToKML(hexColor) {
  hexColor = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
  const r = hexColor.slice(0, 2);
  const g = hexColor.slice(2, 4);
  const b = hexColor.slice(4, 6);
  return `80${b}${g}${r}`;
}

  reader.onload = function (e) {
    const contents = e.target.result;
    const lines = contents.split('\n');
    const color = document.getElementById('colorPicker').value;
    const colorKML = rgbHexToKML(color);

    let kml = '<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n';

      kml += '<Document>';
      kml += '  <name>Antena y Cobertura</name>';
      kml += '  <description>UDAPIFMZA</description>';
      kml += `  <Style id="Estilopoligono">`;
      kml += `    <LineStyle>`;
      kml += `      <color>${colorKML}</color>`;
      kml += `      <width>2</width>`;
      kml += `    </LineStyle>`;
      kml += `    <PolyStyle>`;
      kml += `      <color>${colorKML}</color>`;
      kml += `    </PolyStyle>`;
      kml += `  </Style>`;

      lines.forEach((line, index) => {
        if (index > 0) {
          const columns = line.split(';');
          const nombre = columns[1];
          const lat = parseFloat(columns[2]);
          const lng = parseFloat(columns[3]);
          const azimuth = parseFloat(columns[4]);
          const apertura = parseFloat(columns[5]);
          const radio = parseFloat(columns[6]);
          const numPuntos = 61;
          const puntos = [`${lng},${lat},0`];
          
            for (let i = 0; i < 30; i++) {
            const angle = ((azimuth - apertura / 2) + (apertura / (numPuntos - 1)) * i) * Math.PI / 180;
            const dx = radio * Math.sin(angle) / (111.32 * Math.cos(lat * Math.PI / 180));
            const dy = radio * Math.cos(angle) / 111.32;
            puntos.push(`${(lng + dx).toFixed(6)},${(lat + dy).toFixed(6)},0`);
          }
          puntos.push(`${lng},${lat},0`);

          kml += `  <Folder>`;
          kml += `    <name>${nombre}</name>`;
          kml += `    <Placemark>`;
          kml += `      <name>Cobertura de ${nombre}</name>`;
          kml += `      <description>${nombre}</description>`;
          kml += `      <styleUrl>#Estilopoligono</styleUrl>`;
          kml += `      <Polygon>`;
          kml += `        <outerBoundaryIs>`;
          kml += `          <LinearRing>`;
          kml += `            <coordinates>`;
          kml += `              ${puntos.join('\n                ')}`;
          kml += `            </coordinates>`;
          kml += `          </LinearRing>`;
          kml += `        </outerBoundaryIs>`;
          kml += `      </Polygon>`;
          kml += `    </Placemark>`;
          kml += `  </Folder>`;

        }
      });

      kml += '</Document>';
      kml += '</kml>';

    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.click();

  };

  reader.readAsText(txtFile);
}