module Jsonp
  class PatchDataTables
    attr_accessor :operations
    def initialize(operations)
      @operations = operations
    end
    
    def render
      {
        json: {
          operations: @operations,
        }.to_json,
        callback: :patchDataTables,
      }
    end
  end
end
