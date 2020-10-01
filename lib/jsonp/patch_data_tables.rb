module Jsonp
  class ShowModal
    attr_accessor :html
    def initialize(html)
      @html = html
    end
    
    def render
      {
        json: {
          html: @html,
        }.to_json,
        callback: :showModal,
      }
    end
  end
end
