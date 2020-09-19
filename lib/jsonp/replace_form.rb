module Jsonp
  class ReplaceForm
    attr_accessor :html
    def initialize(html)
      @html = html
    end
    
    def render
      {
        json: {
          html: @html,
        }.to_json,
        callback: :replaceForm,
      }
    end
  end
end
