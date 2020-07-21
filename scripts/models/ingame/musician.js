class Musician{
  constructor(){
      this.lastMidiRecord = 0xffffffff;
      this.program = PROGRAM;
      this.collisionArray = [];

    //SYNTHS: synth is an array of FM synths for banging chords. recall is a poly synth to be used for replay
    //to do just have one poly fm synth
        this.synth = [];
          this.bass = new Tone.FMSynth(); this.synth.push(this.bass);
          this.tenor = new Tone.FMSynth(); this.synth.push(this.tenor);
          this.alto = new Tone.FMSynth(); this.synth.push(this.alto);
          this.soprano = new Tone.FMSynth(); this.synth.push(this.soprano);

        this.EndSynth = [];
            this.b = new Tone.FMSynth(); this.EndSynth.push(this.b);
            this.t = new Tone.FMSynth(); this.EndSynth.push(this.t);
            this.a = new Tone.FMSynth(); this.EndSynth.push(this.a);
            this.s = new Tone.FMSynth(); this.EndSynth.push(this.s);

        for(var i = 0; i < this.EndSynth.length; i ++)
          this.EndSynth[i].toMaster();

        this.recall = new Tone.PolySynth(4, Tone.FMSynth).toMaster();

        this.vibeSynth = new Tone.FMSynth().toMaster();

        this.kalimba = new Tone.PolySynth(4, Tone.FMSynth).toMaster();


    //EFFECTS
        this.pan = [];
        this.delay = [];
        var delaySet = [.25, .29, .21, .27];
        var panSet = [0, -1, 1, 0]
        for(var i = 0; i < 4; i ++){
          this.pan.push(new Tone.PanVol(panSet[i], -10));
          this.delay.push(new Tone.FeedbackDelay(delaySet[i], .85));
        }

    //SYNTH SETTINGS
        this.vibeSynth.set(this.program[0]);
        this.kalimba.set(this.program[5]);
        this.recall.set(this.program[1]);

        for(var i = 0; i < this.synth.length; i ++)
          this.synth[i].set(this.program[2]);

        for(var i = 0; i < this.EndSynth.length; i ++)
          this.EndSynth[i].set(this.program[0]);

  //ROUTING
        for(var i = 0; i < this.synth.length; i ++)
          this.synth[i].chain(this.delay[i], this.pan[i], Tone.Master);
}

  makeTone(midiByte){
    return Tone.Frequency(midiByte, "midi");
  }
  makeChord(midiRecord){
    let chord = [];
    for(var i = 0; i < 4; i ++)
      chord.push(this.makeTone(utility.getByte(i,midiRecord)));
    return chord;
  }

  scoreTutorial(message, index){
    var tutorialChords = [
       [61, 63, 66]
      ,[63, 66, 68]
      ,[66, 68, 70]
      ,[68, 70, 73]
      ,[70, 73, 75]
      ,[73, 75, 78]
      ,[75, 78, 80]
      ,[78, 80, 82]
      ,[80, 82 ,85]
    ]
    if(message == 'next'){
      this.kalimba.triggerAttackRelease(this.makeTone(tutorialChords[index][0]), '64n')
      this.kalimba.triggerAttackRelease(this.makeTone(tutorialChords[index][1]), '64n', '+64n')
      this.kalimba.triggerAttackRelease(this.makeTone(tutorialChords[index][2]), '64n', '+32n')}

    if(message == 'prev'){
      this.kalimba.triggerAttackRelease(this.makeTone(tutorialChords[index][2]), '64n')
      this.kalimba.triggerAttackRelease(this.makeTone(tutorialChords[index][1]), '64n', '+64n')
      this.kalimba.triggerAttackRelease(this.makeTone(tutorialChords[index][0]), '64n', '+32n')}

    if(message =='done' || message == 'skip')
      this.kalimba.triggerAttackRelease([66, 68, 70, 73, 75, 78].map(e=>this.makeTone(e)), '16n')
  }


  scoreVoiceMovement(activeVoice){
    if(utility.getByte(activeVoice, MIDI_RECORD) != 0xff){
        this.kalimba.triggerAttackRelease(this.makeTone(utility.getByte(activeVoice,MIDI_RECORD)), "8n");
        }
    else
      return false;
  }
  prepareCollisionScore(exCols){
    this.collisionArray = [];
    var direction = 1;
    var byteIndex = 0;

    var goodMidiNotes = [];
    for(var i = 0; i < 4; i ++)
      if( utility.getByte(i,MIDI_RECORD) != 255)
        goodMidiNotes.push(utility.getByte(i,MIDI_RECORD));


    while(this.collisionArray.length < exCols){
        this.collisionArray.push( goodMidiNotes[byteIndex] );
        byteIndex += direction;
        if(byteIndex == goodMidiNotes.length - 1 || byteIndex == 0)
          direction*=-1;
    }
  }
  scoreCollision(n, cols){
    this.vibeSynth.triggerAttackRelease(this.makeTone(this.collisionArray[cols]), "8n");
  }
}
