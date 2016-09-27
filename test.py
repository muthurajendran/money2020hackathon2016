import xmlrpclib

server_url = 'http://104.154.120.49:4560'
server = xmlrpclib.ServerProxy(server_url, verbose=True)

EJABBERD_XMLRPC_LOGIN = {'user': 'admin',
                         'password': 'rajendran',
                         'server': '104.154.120.49',
                         'admin': True}


def ejabberdctl(command, data):
    fn = getattr(server, command)
    return fn(EJABBERD_XMLRPC_LOGIN, data)

print "create room"
print ejabberdctl('register', {'host': '104.154.120.49',
                                'user': 'test1234',
                                'password': 'rajendran'})

# print "get room options"
# print ejabberdctl('get_room_options', {'name': 'test12',
#                                        'service': 'conference'})

