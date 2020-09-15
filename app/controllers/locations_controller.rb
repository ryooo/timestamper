class LocationsController < ApplicationController
  before_action :authenticate_user!
  def index
    render_jsonps([
      Jsonp::ShowModal.new(render_to_string(layout: nil)),
    ])
  end
end
