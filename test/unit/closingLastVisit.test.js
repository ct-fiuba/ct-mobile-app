const scanService = require('../../src/services/ScanService');
const nock = require('nock');

describe('Testing the two isolated functions that determine if the last visit should be closed', () => {

	describe('isLastVisitStillClosable() check if the last visit should be closed by a generic new visit', () => {
		test('visit made one minute ago with an estimated visit duration of 60 minutes should be closable', () => {
			const entranceTimestamp = new Date();
			entranceTimestamp.setMinutes(entranceTimestamp.getMinutes() - 1);
			const estimatedVisitDuration = 60
			const lastVisit = {
				entranceTimestamp,
				"vaccinated": 0,
				"covidRecovered": false,
				"scanCode": "612bd2bdf9cd7d0019fb8a41",
				"userGeneratedCode": "1982ec17-91a7-43e3-8152-7e70e899d5a2",
				estimatedVisitDuration
			}

			const res = scanService.isLastVisitStillClosable(lastVisit);
			expect(res).toBeTruthy();
		});

		test('visit made 31 minutes ago with an estimated visit duration of 30 minutes should be closable', () => {
			const entranceTimestamp = new Date();
			entranceTimestamp.setMinutes(entranceTimestamp.getMinutes() - 31);
			const estimatedVisitDuration = 30
			const lastVisit = {
				entranceTimestamp,
				"vaccinated": 0,
				"covidRecovered": false,
				"scanCode": "612bd2bdf9cd7d0019fb8a41",
				"userGeneratedCode": "1982ec17-91a7-43e3-8152-7e70e899d5a2",
				estimatedVisitDuration
			}

			const res = scanService.isLastVisitStillClosable(lastVisit);
			expect(res).toBeTruthy();
		});

		test('visit made 90 minutes ago with an estimated visit duration of 30 minutes should not be closable', () => {
			const entranceTimestamp = new Date();
			entranceTimestamp.setMinutes(entranceTimestamp.getMinutes() - 90);
			const estimatedVisitDuration = 30
			const lastVisit = {
				entranceTimestamp,
				"vaccinated": 0,
				"covidRecovered": false,
				"scanCode": "612bd2bdf9cd7d0019fb8a41",
				"userGeneratedCode": "1982ec17-91a7-43e3-8152-7e70e899d5a2",
				estimatedVisitDuration
			}

			const res = scanService.isLastVisitStillClosable(lastVisit);
			expect(res).toBeFalsy();
		});
	});

	describe('isExitScanClosingLastVisit() check if the last visit should be closed by the current exit scan', () => {
		test('visit made one minute ago with an estimated visit duration of 60 minutes, with the same scanId, should close last visit', () => {
			const entranceTimestamp = new Date();
			entranceTimestamp.setMinutes(entranceTimestamp.getMinutes() - 1);
			const estimatedVisitDuration = 60;
			const scanCode = "612bd2bdf9cd7d0019fb8a41";
			const lastVisit = {
				entranceTimestamp,
				"vaccinated": 0,
				"covidRecovered": false,
				scanCode,
				"userGeneratedCode": "1982ec17-91a7-43e3-8152-7e70e899d5a2",
				estimatedVisitDuration
			}

			const res = scanService.isExitScanClosingLastVisit(lastVisit, scanCode);
			expect(res).toBeTruthy();
		});

		test('visit made one minute ago with an estimated visit duration of 60 minutes, with the a different scanId, should not close last visit', () => {
			const entranceTimestamp = new Date();
			entranceTimestamp.setMinutes(entranceTimestamp.getMinutes() - 1);
			const estimatedVisitDuration = 60;
			const scanCodeLastVisit = "612bd2bdf9cd7d0019fb8a41";
			const scanCodeCurrentScan = "612bd2bdf9cd7d0019fb8a42";
			const lastVisit = {
				entranceTimestamp,
				"vaccinated": 0,
				"covidRecovered": false,
				"scanCode": scanCodeLastVisit,
				"userGeneratedCode": "1982ec17-91a7-43e3-8152-7e70e899d5a2",
				estimatedVisitDuration
			}

			const res = scanService.isExitScanClosingLastVisit(lastVisit, scanCodeCurrentScan);
			expect(res).toBeFalsy();
		});

		test('visit made 29 minutes ago with an estimated visit duration of 10 minutes, with the same scanId, should close last visit', () => {
			const entranceTimestamp = new Date();
			entranceTimestamp.setMinutes(entranceTimestamp.getMinutes() - 29);
			const estimatedVisitDuration = 10;
			const scanCode = "612bd2bdf9cd7d0019fb8a41";
			const lastVisit = {
				entranceTimestamp,
				"vaccinated": 0,
				"covidRecovered": false,
				scanCode,
				"userGeneratedCode": "1982ec17-91a7-43e3-8152-7e70e899d5a2",
				estimatedVisitDuration
			}

			const res = scanService.isExitScanClosingLastVisit(lastVisit, scanCode);
			expect(res).toBeTruthy();
		});

		test('visit made 31 minutes ago with an estimated visit duration of 10 minutes, with the same scanId, should not close last visit', () => {
			const entranceTimestamp = new Date();
			entranceTimestamp.setMinutes(entranceTimestamp.getMinutes() - 31);
			const estimatedVisitDuration = 10;
			const scanCode = "612bd2bdf9cd7d0019fb8a41";
			const lastVisit = {
				entranceTimestamp,
				"vaccinated": 0,
				"covidRecovered": false,
				scanCode,
				"userGeneratedCode": "1982ec17-91a7-43e3-8152-7e70e899d5a2",
				estimatedVisitDuration
			}

			const res = scanService.isExitScanClosingLastVisit(lastVisit, scanCode);
			expect(res).toBeFalsy();
		});
	});
});
