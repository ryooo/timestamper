module Jsonp
  class Redirect
    attr_accessor :url
    def initialize(url)
      @url = url
    end
    
    def render
      {
        plain:
          "Turbolinks.clearCache();" + 
          %!Turbolinks.visit("#{@url}", {"action":"advance"})!
      }
    end
  end
end
