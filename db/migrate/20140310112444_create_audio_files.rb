class CreateAudioFiles < ActiveRecord::Migration
  def change
    create_table :audio_files do |t|
        t.string "filename"
        t.string "ip"

      t.timestamps
    end
  end
end
