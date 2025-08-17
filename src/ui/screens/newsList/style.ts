import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
    list:
    {
        flex:1
    },
    listItem:
    {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    shadowColor: '#000',
    borderColor: '#acaaaaff',
    borderWidth: 1,
    margin: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 10,
},

    root: {
    flex: 1,
  },
   newsImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
  },
})