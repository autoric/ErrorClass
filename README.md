# lr-error

Library for creating robust, useful error classes.

# Usage

```javascript
createErrorClass = require('lr-error');

NotFoundError = createErrorClass("NotFoundError", {
  status : 404,
  message : "Resource not found",
  detail : "The requested resource could not be found."
});

app.get('/:sessionId', function (req, res, next) {
  if(!hasSession(req.params.sessionId)) {
    throw new NotFoundError();
  }
});
```

```javascript
createErrorClass = require('lr-error');

NotFoundError = createErrorClass("NotFoundError", {
  status : 404,
  message : "Resource not found",
  detail : "The requested resource could not be found."
});

// Overrides the default message with a more specific message.
new NotFoundError("The requested session could not be found");

// Overrides default properties
new NotFoundError({
  message : "The requested session could not be found",
  detail : "SERIOUSLY WHERE IS IT THOUGH!?"
})
```

# Changelog

### v0.0.1

 - Initial release.
