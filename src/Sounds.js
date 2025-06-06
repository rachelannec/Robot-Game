import { bgm, sfx } from "./Assets";

class SoundManager {
	constructor() {
		this.bgm = bgm;
		this.sfx = sfx;
		this.muted = { bgm: false, sfx: false };
	}

	play(name, loop = false, type = "sfx") {
		// console.log("Muted: ", this.muted);
		if (this.muted[type]) return;

		const sound =
			type === "bgm" ? this.bgm[name]?.audio : this.sfx[name]?.audio;
		if (sound) {
			sound.currentTime = 0;
			sound.loop = loop;
			sound.play().catch((error) => {
				console.error(`Error playing sound ${name}:`, error);
			});
		} else {
			console.error(`Sound ${name} not found in ${type}.`);
		}
	}

	resume(name, loop, type = "sfx") {
		if (this.muted[type]) return;

		const sound =
			type === "bgm" ? this.bgm[name]?.audio : this.sfx[name]?.audio;
		if (sound) {
			sound.loop = loop;
			sound.play().catch((error) => {
				console.error(`Error resuming sound ${name}:`, error);
			});
		}
	}

	stop(name, type = "sfx") {
		const sound =
			type === "bgm" ? this.bgm[name]?.audio : this.sfx[name]?.audio;
		if (sound) {
			sound.pause();
			// sound.currentTime = 0;
		}
	}

	setVolume(name, volume, type = "sfx") {
		const sound =
			type === "bgm" ? this.bgm[name]?.audio : this.sfx[name]?.audio;
		if (sound) {
			// console.log(`Setting volume for ${name} to ${volume}`);
			sound.volume = volume;
		}
	}

	mute(type) {
		this.muted[type] = true;
		const sounds = type === "bgm" ? this.bgm : this.sfx;
		Object.values(sounds).forEach((audio) => {
			if (audio.audio) audio.audio.muted = true;
		});
	}

	unmute(type) {
		this.muted[type] = false;
		const sounds = type === "bgm" ? this.bgm : this.sfx;
		Object.values(sounds).forEach((audio) => {
			if (audio.audio) audio.audio.muted = false;
		});
	}

	pauseAll() {
		Object.values(this.sfx).forEach((audio) => {
			if (audio.audio && !audio.audio.paused) audio.audio.pause();
		});
	}

	resumeAll() {
		// Resume BGM if it was playing
		Object.values(this.bgm).forEach((audio) => {
			if (audio.audio && !this.muted.bgm && audio.audio.loop)
				audio.audio.play();
		});
	}
}

export let soundManager = new SoundManager();
