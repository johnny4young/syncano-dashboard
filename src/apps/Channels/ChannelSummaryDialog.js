import React from 'react';
import Reflux from 'reflux';

import Store from './ChannelSummaryDialogStore';
import ChannelsStore from './ChannelsStore';
import SessionStore from '../Session/SessionStore';

import { DialogMixin } from '../../mixins';
import { CodePreview, Dialog, Loading } from '../../common/';
import { Card, CardTitle, CardText } from 'material-ui';
import { colors as Colors } from 'material-ui/styles/';

export default React.createClass({
  displayName: 'ChannelSummaryDialog',

  contextTypes: {
    params: React.PropTypes.object
  },

  mixins: [
    Reflux.connect(Store),
    Reflux.connect(ChannelsStore, 'channels'),
    DialogMixin
  ],

  render() {
    const { open, channels } = this.state;
    const item = ChannelsStore.data.items[0];
    const token = SessionStore.getToken();
    const currentInstance = SessionStore.getInstance();
    const showSummaryDialog = (!item || !currentInstance || !token || channels.isLoading);

    return (
      <Dialog.FullPage
        key="dialog"
        ref="dialog"
        title={!showSummaryDialog ? "You've just created a Channel!" : ''}
        titleStyle={{ paddingLeft: 72 }}
        onRequestClose={this.handleCancel}
        loading={channels.isLoading}
        open={open}
      >
        {!showSummaryDialog && (
          <div style={{ position: 'absolute', top: 0, left: 24 }}>
            <span
              className="synicon-socket-channel"
              style={{ color: Colors.blue500, fontSize: 32 }}
            />
          </div>
        )}
        {showSummaryDialog ? <Loading show={true} /> : (
          <div>
            <Dialog.ContentSection>
              <div className="col-flex-1">
                <div style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(68,68,68, .8)' }}>
                  <p>
                    Channel you just created can always be modified later. Channels are a way of providing
                    realtime communication functionality in Syncano. Users can subscribe to Channels
                    to send or receive notifications about changes that happen to Data Objects connected to
                    those Channels.
                  </p>
                </div>
              </div>
            </Dialog.ContentSection>
            <Dialog.ContentSection>
              <div className="col-flex-1">
                <Card>
                  <CardTitle title="Use in your App" />
                  <CardText>
                    <p>Choose your favorite language below and copy the code.</p>
                    <CodePreview>
                      <CodePreview.Item
                        title="cURL"
                        languageClassName="markup"
                        code={'# Polling for changes\n\n' +
                        `curl -X GET \\\n-H "X-API-KEY: ${token}" \\\n"${SYNCANO_BASE_URL}v1.1/instances/` +
                        `${currentInstance.name}/channels/${item.name}/poll/"\n\n` +
                        '# Publishing custom messages (custom_publish flag must be set on true)\n\n' +
                        `curl -X POST \\\n-H "X-API-KEY: ${token}" \\\n-H "Content-type: application/json" \\\n` +
                        `-d '{"payload":{"message":"Hello there!", "type":"welcome"}, "room":"${item.name}"}' \\\n` +
                        `"${SYNCANO_BASE_URL}v1.1/instances/${currentInstance.name}/channels/` +
                        `${item.name}/publish/"`}
                      />
                      <CodePreview.Item
                        title="Python"
                        languageClassName="python"
                        code={'# Polling for changes\n\n' +
                        'import syncano\nfrom syncano.models import Channel\n\n' +
                        `def callback(message=None):\n  print message.payload\n  return True\n\n` +
                        `syncano.connect(api_key="${token}")\n\nchannel = Channel.please.get(\n  instance_name="` +
                        `${currentInstance.name}",\n  name="${item.name}"\n)\n\nchannel.poll(callback=callback)\n\n` +
                        '# Publishing custom messages (custom_publish flag must be set on true)\n\n' +
                        `channel = Channel.please.get(instance_name="${currentInstance.name}", name="${item.name}")\n` +
                        'channel.publish(\n  payload={"message":"Hello there!"}\n)'}
                      />
                      <CodePreview.Item
                        title="JavaScript"
                        languageClassName="javascript"
                        code={'// Polling for changes\n\n' +
                        `var Syncano = require("syncano");\nvar connection = Syncano(` +
                        `{accountKey: "${token}"});\nvar Channel = connection.Channel;\n\n` +
                        `var poll = Channel\n  .please()\n  .poll({ instanceName: '${currentInstance.name}',` +
                        ` name: '${item.name}' });\n\npoll.on('create', function(data) {\n` +
                        `  console.log('poll::create', data)\n});\n\npoll.on('update', function(data) {\n` +
                        `  console.log('poll::update', data)\n});\n\npoll.on('delete', function(data) {\n` +
                        `  console.log('poll::delete', data)\n});\n\n` +
                        '// Publishing custom messages (custom_publish flag has to be set on true)\n\n' +
                        `var query = {instanceName: "${currentInstance.name}", name: "${item.name}"};\n` +
                        `var message = {content: "Hello there!"};\n\n` +
                        'Channel\n  .please()\n  .publish(query, message)\n  .then(callback);'}
                      />
                    </CodePreview>
                  </CardText>
                </Card>
              </div>
            </Dialog.ContentSection>
          </div>
        )}
      </Dialog.FullPage>
    );
  }
});
