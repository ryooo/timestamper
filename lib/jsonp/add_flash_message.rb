module Jsonp
  class AddFlashMessage
    attr_accessor :message, :type
    def initialize(message, type = :alert)
      @message = message
      @type = type
    end
    
    def to_h
      {
        json: {
          type: @type,
          message: @message,
        }.to_json,
        callback: :addFlashMessage,
      }
    end
  end
end
