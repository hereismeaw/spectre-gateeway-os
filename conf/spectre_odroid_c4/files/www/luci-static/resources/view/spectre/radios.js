'use strict';
'require view';
'require form';

return view.extend({
	render: function () {
		var m, s, o;

		m = new form.Map('spectre', _('SpectreOS'),
			_('Choose the board and the cards that are fitted. Save & Apply starts the matching concentrator or HaLow driver.'));

		s = m.section(form.NamedSection, 'main', 'radio', _('Radios'));

		o = s.option(form.ListValue, 'board', _('Board'));
		o.value('odroid-c4', 'Odroid-C4 (S905X3)');
		o.value('m1', 'SenseCAP M1');
		o.value('rak7391', 'RAK7391');
		o.rmempty = false;

		o = s.option(form.ListValue, 'm1_socket', _('mini-PCIe socket'));
		o.depends('board', 'm1');
		o.value('lora', _('LoRa WM1302'));
		o.value('wm6108', _('HaLow Wio-WM6108'));
		o.value('empty', _('Empty'));
		o.rmempty = false;

		o = s.option(form.ListValue, 'm1_lora', _('LoRa interface'));
		o.depends({ board: 'm1', m1_socket: 'lora' });
		o.value('spi', _('SPI'));
		o.value('usb', _('USB, cabled to a Pi USB port'));
		o.rmempty = false;

		o = s.option(form.ListValue, 'm1_hat', _('HAT stacked on the 40-pin header'));
		o.depends('board', 'm1');
		o.value('none', _('None'));
		o.value('ahpi7292s', 'AHPI7292S');
		o.rmempty = false;
		o.validate = function (section_id, value) {
			if (value !== 'ahpi7292s')
				return true;
			var socket = this.map.lookupOption('m1_socket', section_id)[0].formvalue(section_id);
			var lora = this.map.lookupOption('m1_lora', section_id)[0].formvalue(section_id);
			if (socket === 'wm6108')
				return _('Wio-WM6108 and AHPI7292S share SPI0 CE0 and GPIO5. Fit only one.');
			if (socket === 'lora' && lora !== 'usb')
				return _('SPI LoRa and AHPI7292S share GPIO8. Use a USB LoRa module, or remove the AHPI.');
			return true;
		};

		o = s.option(form.ListValue, 'rak_halow', _('HaLow'));
		o.depends('board', 'rak7391');
		o.value('none', _('None'));
		o.value('wm6108', _('Wio-WM6108 in an mPCIe slot'));
		o.value('ahpi7292s', _('AHPI7292S on the 40-pin header'));
		o.rmempty = false;

		o = s.option(form.ListValue, 'rak_halow_slot', _('Wio-WM6108 slot'));
		o.depends({ board: 'rak7391', rak_halow: 'wm6108' });
		o.value('1', _('Slot 1, LoRa on that slot stays off'));
		o.value('2', _('Slot 2, LoRa on that slot stays off'));
		o.rmempty = false;

		o = s.option(form.Flag, 'rak_slot1', _('LoRa slot 1'), _('USB card at /dev/ttyACM0, reset GPIO17'));
		o.depends('board', 'rak7391');
		o.rmempty = false;

		o = s.option(form.Flag, 'rak_slot2', _('LoRa slot 2'), _('USB card at /dev/ttyACM1, reset GPIO6'));
		o.depends('board', 'rak7391');
		o.rmempty = false;

		var halowDepends = [
			{ board: 'm1', m1_socket: 'wm6108' },
			{ board: 'm1', m1_hat: 'ahpi7292s' },
			{ board: 'rak7391', rak_halow: 'wm6108' },
			{ board: 'rak7391', rak_halow: 'ahpi7292s' }
		];

		o = s.option(form.ListValue, 'halow_mode', _('HaLow mode'));
		halowDepends.forEach(function (dep) { o.depends(dep); });
		o.value('ap', _('Access point, 192.168.11.1'));
		o.value('sta', _('Client'));
		o.value('mesh', _('802.11s mesh'));
		o.rmempty = false;

		o = s.option(form.Value, 'halow_ssid', _('HaLow SSID'));
		halowDepends.forEach(function (dep) { o.depends(dep); });
		o.datatype = 'maxlength(32)';
		o.placeholder = 'SpectreOS-HaLow';
		o.rmempty = false;

		o = s.option(form.Value, 'halow_key', _('HaLow passphrase'));
		halowDepends.forEach(function (dep) { o.depends(dep); });
		o.datatype = 'wpakey';
		o.password = true;
		o.placeholder = 'spectre168';
		o.rmempty = false;

		o = s.option(form.ListValue, 'halow_plan', _('HaLow channel'),
			_('920–925 MHz, the Morse SG domain. This driver has no TH domain. Thailand uses this same band.'));
		halowDepends.forEach(function (dep) { o.depends(dep); });
		o.value('37/1', _('920.5 MHz, 1 MHz'));
		o.value('39/1', _('921.5 MHz, 1 MHz'));
		o.value('41/1', _('922.5 MHz, 1 MHz'));
		o.value('43/1', _('923.5 MHz, 1 MHz'));
		o.value('45/1', _('924.5 MHz, 1 MHz'));
		o.value('38/2', _('921 MHz, 2 MHz'));
		o.value('42/2', _('923 MHz, 2 MHz'));
		o.value('40/4', _('922 MHz, 4 MHz'));
		o.rmempty = false;

		o = s.option(form.ListValue, 'halow_bcf', _('Wio-WM6108 board file'));
		o.depends({ board: 'm1', m1_socket: 'wm6108' });
		o.depends({ board: 'rak7391', rak_halow: 'wm6108' });
		o.value('bcf_fgh100mhaamd.bin', _('Quectel FGH100M-H (Seeed Wio-WM6108)'));
		o.value('bcf_fgh100mabmd.bin', _('Quectel FGH100M-ABMD'));
		o.value('bcf_fgh100maamd.bin', _('Quectel FGH100M-AAMD'));
		o.value('bcf_fgh100mjaamd.bin', _('Quectel FGH100M-JAAMD'));
		o.rmempty = false;

		o = s.option(form.DummyValue, '_note', _('Limits'));
		o.rawhtml = true;
		o.cfgvalue = function () {
			return '<ul>' +
				'<li>SenseCAP M1 has one socket. LoRa and Wio-WM6108 cannot be fitted together.</li>' +
				'<li>AHPI7292S uses SPI0 CE0 (GPIO8) and an IRQ on GPIO5. It cannot share those pins with SPI LoRa or Wio-WM6108.</li>' +
				'<li>A USB LoRa module can run with AHPI7292S. Cable it to a Pi USB port.</li>' +
				'<li>Region and concentrator model are set in the ChirpStack menus. The default region is AS923.</li>' +
				'<li>Wio-WM6108 uses SPI0 CE0, reset GPIO17, IRQ GPIO5, wake GPIO23 and busy GPIO24. Save &amp; Apply loads that overlay only while this card is selected.</li>' +
				'<li>AHPI7292S is an NRC7292. It is not a Morse radio, so the Morse wizards stay empty until a Wio-WM6108 is fitted.</li>' +
				'<li>The HaLow access point is 192.168.11.1. The 2.4 GHz setup AP stays on 192.168.168.1.</li>' +
				'<li>Odroid-C4 uses a USB LoRa concentrator. Its 40-pin header is not the Raspberry Pi pinout, so the Wio-WM6108 and AHPI7292S SPI setup is not applied on this board.</li>' +
				'</ul>';
		};

		return m.render().then(function (node) {
			var box = document.createElement('div');
			var img = document.createElement('img');
			img.src = '/luci-static/resources/spectre/banner.png';
			img.alt = 'SpectreOS';
			img.style.cssText = 'display:block;max-width:720px;width:100%;height:auto;margin:0 0 16px';
			box.appendChild(img);
			if (node)
				box.appendChild(node);
			return box;
		});
	},
});
