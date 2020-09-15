module Jsonp
  class ReplaceForm
    attr_accessor :html
    def initialize(html)
      @html = html
    end
    
    def to_h
      {
        json: {
          html: @html,
        }.to_json,
        callback: :replaceForm,
      }
    end
  end
end
