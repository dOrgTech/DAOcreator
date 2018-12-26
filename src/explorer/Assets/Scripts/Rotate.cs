using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace dOrg
{
  public class Rotate : MonoBehaviour
  {
    void Update()
    {
      this.transform.Rotate(Vector3.up * Time.deltaTime * 10.0f);
    }
  }
}
