require 'securerandom'
class HomeController < ApplicationController

    def recording

    end

    def record
        @files = AudioFiles.where(ip: request.remote_ip.to_s).order("created_at DESC")
    end

    def saveRecording

        audio = params["record"]["audio"]

        filename = SecureRandom.hex

        save_path = Rails.root.join("public/audioClips/#{filename}.wav")

        File.open(save_path,"wb") do |f|
            f.write audio.read
        end

        AudioFiles.create(ip: request.remote_ip.to_s, filename: filename)

        render nothing: true
    end

    def delete
        file = AudioFiles.find(params[:id])
        if(file.ip == request.remote_ip)
            file.destroy
            path = Rails.root.join("public/audioClips/#{file.filename}.wav")
            `rm #{path}`
        end
        redirect_to(action: "record")
    end

end
